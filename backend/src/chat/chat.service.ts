import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { WsException } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { MessageDTO, ChannelDTO } from 'src/chat/dto/chat.dto';
import { chatPreview, oneMessage } from './type/chat.type';
import * as argon from 'argon2';

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService, private userService: UserService) {}

	async	display_users() {
		const users = await this.prisma.user.findMany();
		let count = 0;
		for (const [index, user] of users.entries()) {
			console.log(`User ${index}: ${user.name}`);
			count++;
		}
		console.log(`Total users: ${count}`);
		return ;
	}

	async	display_channels() {
		const channels = await this.prisma.channel.findMany();
		let count = 0;
		for (const [index, channel] of channels.entries()) {
			console.log(`Channel ${index}: ${channel.name}`);
			count++;
		}
		console.log(`Total channels: ${count}`);
		return ;
	}

	async	get_message_by_id(id: number) {
		try {
			const message = await this.prisma.message.findUnique({
				where: { id, },
				select: {
					id: true,
					content: true,
					createdAt: true,
					updatedAt: true,
					userId: true,
					channelId: true,
					owner: {
						select: {
							id: true,
							email: true,
							name: true,
						},
					},
				},
			});
			return message;
		}
		catch (error) {
			throw new WsException(error.message);
		}
	}

	async	create_messageDTO(source: any) : Promise<oneMessage> {
		if (!source) return (null);
		const data: oneMessage = {
			msgId: source.id,
			msg: source.msg,
			channelId: source.channelId,
			createAt: source.createdAt,
			updateAt: source.updatedAt,
			isInvite: false,
			id: source.owner.id,
			email: source.owner.email,
			username: source.owner.username,
		};
		return data;
	}
	
	async	getUserIdByMail(mail: string)
	{
		try
		{
			const user = await this.prisma.user.findFirst({
				where: { email: mail, },
				select: { id: true, },
			});
			return (user.id);
		}
		catch (error)
		{
			console.log("getUserIdByEmail error: ", error);
		}
	}

	async	new_message(data: MessageDTO) {
		try {
			const id = await this.getUserIdByMail(data.email); // Get user id by email
			const isMuted = await this.isMuted(id, data.channel_id); // Check if user is muted
			if (isMuted) return ; // If user is muted, message is not created
			const message = await this.prisma.message.create({
				data: {
					content: data.message,
					history: [data.message],
					owner: { connect: { email: data.email, }, },
					channel: { connect: { id: data.channel_id } },
				},
			});
			// The createdAt value is set when the message is created, but the updatedAt value is not.
			await this.prisma.message.update({
				where: { id: message.id, },
				data: { updatedAt: message.createdAt, userId: id, },
			});
			const msg = await this.get_message_by_id(message.id);
			const msgDTO = await this.create_messageDTO(msg);
			return msgDTO;
		}
		catch (error) {
			throw new WsException(error.message);
		}        
	}

	async	isMuted(id: number, channelId: number) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id, }, select: { muted: true,},
			});
			const channel = await this.prisma.channel.findUnique({
				where: { id: channelId, }, select: { muted: true, },
			});
			return user.muted;
		}
		catch (error) {
			throw new WsException(error.message);
		}
	}

	// async	updateMutedChecker(id: number, channelId: number) {
	//     try {
	//         const user = await this.prisma.mute.updateMany({
	//             where: {
	//                 AND : [
	//                     { userId: id, },
	//                     { channelId: channelId, },
	//                 ],
	//             },
	//            data: { muted: true, },
	//         });
	//     }
	//     catch (error) {
	//         throw new WsException(error.message);
	//     }
	// }

	async	create_channel(info: ChannelDTO) {
		try {
			const password = info.password ? await argon.hash(info.password) : null;
			const channel = await this.prisma.channel.create({  
				data: {
					name: info.name,
					private: info.private,
					isProtected: info.isProtected,
					password: password,
					owners : { connect: { email: info.email, }, },
					admins : { connect: { email: info.email, }, },
					members: { connect: info.members.map((member) => ({ id: member.id, }))
					},
				},
			});
			return channel.id;
		} catch (error) {
			console.log("Failed to create new channel: ", error);
			throw new WsException(error);
		}
	}

	async	get_channel_by_id(channelId: number) {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: { id: channelId, },
				select: {
					id: true,
					dm: true,
					name: true,
					isProtected: true,
					updatedAt: true,
					owners: {
						select: {
							id: true,
							email: true,
							name: true,
						},
					},
					messages: {
						where: { unsent: false, },
						orderBy: { createdAt: 'asc', },
						select: { content: true, },
						take: 1,
					},
				},
			});
			return channel;
		} catch (error) {
			console.log('get_channel_by_id error:', error);
			throw new WsException(error);
		}
	}

	async	get_preview(channelId: number, email: string) : Promise<chatPreview> {
		try {
			const channel = this.get_channel_by_id(channelId);
			const preview = this.create_preview(channel, email);
			return preview;
		} catch (error) {
			console.log("Failed to get channel preview: ", error);
			throw new WsException(error);
		}
	}

	create_preview(source: any, email: string) {
		let messageCount = 0;
		if (source.messages) messageCount = source.messages.length;
		let dmName = '';
		let own = source.owners; // may break if point to wrong place
		if (own.length > 1) {
			dmName = own[0].email === email ? own[1].username : own[0].username;
		} else dmName = 'Empty Chat';
		let otherId = -1;
		if (own.length > 1) {
			otherId =
				own[0].email === email
					? own[1].id
					: own[0].id;
		} else otherId = own[0].id;
		const data: chatPreview = {
			id: source.id,
			dm: source.dm,
			name: source.dm ? dmName : source.name,
			isPassword: source.isPassword,
			updateAt: source.updateAt,
			// eslint-disable-next-line unicorn/no-nested-ternary, prettier/prettier
			lastMsg: source.isPassword ? '' : (messageCount > 0 ? source.messages[0].msg : ''),
			ownerEmail: own.length > 0 ? own[0].email : '',
			ownerId: otherId,
		};
		return data;
	}

	async	get_members_of_channel() {
		try {
			const members = await this.prisma.user.findMany({}); // Get all users
			let count = 0;
			for (const [index, member] of members.entries()) {
				console.log(`Member ${index}: ${member.name}`);
				count++;
			}
			console.log(`Total members: ${count}`); 
		}
		catch (error) {
			throw new WsException(error.message);
		}
	}
}
