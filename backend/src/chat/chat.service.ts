import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ConnectedSocket, WsException } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { MessageDTO, ChannelDTO } from './dto/chat.dto';
import { oneMessage } from './type/chat.type';
import * as argon from 'argon2';
import { UserDto } from 'src/user/dto/user.dto';

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

	async	messages_from_channel_id(channelId: number): Promise<oneMessage[]> {
		try {
			const source = await this.getAllMessages(channelId);
			return await this.loadMessages(source);
		} catch (error) {
			console.log('messages_from_channel_id error:', error);
			throw new WsException(error);
		}
	}

	async getMutedUsers(userId: number, channelId: number): Promise<number[]> {
		const mutedUsers = await this.prisma.mute.findMany({
		  where: {
			userId: userId,
			channelId: channelId
		  },
		  select: {
			mutedId: true
		  }
		});
	
		return mutedUsers.map(mute => mute.mutedId);
	  }
async getAllMessages(channelId: number) {
		try {
			const mutedUsers = await this.prisma.mute.findMany({
			where: { channelId: channelId },
			select: { mutedId: true }
		});
		const mutedUserIds = mutedUsers.map(mute => mute.mutedId);

		const source = await this.prisma.channel.findUnique({
			where: { id: channelId },
			select: {
			  messages: {
				where: {
				  unsent: false,
				  NOT: {
					userId: {
					  in: mutedUserIds
					}
				  }
				},
				orderBy: { createdAt: 'asc' },
				select: {
				  channelId: true,
				  id: true,
				  content: true,
				  createdAt: true,
				  owner: {
					select: {
					  id: true,
					  email: true,
					  name: true
					}
				  }
				}
			  }
			}
		  });
		  return source;
		} catch (error) {
		  console.log('getAllMessages error:', error);
		  throw new WsException(error);
		}
	  }
	

	async	loadMessages(param: any): Promise<oneMessage[]> {
		try {
			if (!param) return (null);
			const source = await param.messages;
			const data = [];
			if (source)
				for (let index = 0; index < source.length; index++) {
					const element: oneMessage = {
						msgId: source[index].id,
						id: source[index].owner.id,
						channelId: source[index].channelId,
						email: source[index].owner.email,
						message: source[index].content,
						createAt: source[index].createdAt,
						updateAt: source[index].updateAt,
						isInvite: false,
						name: source[index].owner.name,
					};
					data.push(element);
				}
			return data;
		} catch (error) { console.log('loadMessages error:', error);}
	}

	async	getRegisteredUsers(channelId: number) {
		try {
			const usersInChannel = this.prisma.channel.findUnique({
				where: { id: channelId },
				select: {
					owners: true,
					admins: true,
					members: true,
					invited: true,
					banned: true
				}
			})
			return usersInChannel;
		} catch (e) { throw new WsException(e.message); }
	}
	
	async	getUsersMPs(email: string) {
		try {
			const userId = await this.userService.getUserByEmail(email).then((user) => user.id);
			const listOfMPs = await this.prisma.user.findUnique({
				where: { id: userId },
				select: { owner: { where: { dm: true } } }
			});

			return listOfMPs.owner;
		} catch (error) { console.log('User\'s not registered to any channel'); }
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
			message: source.content,
			channelId: source.channelId,
			createAt: source.createdAt,
			updateAt: source.updatedAt,
			isInvite: false,
			id: source.owner.id,
			email: source.owner.email,
			name: source.owner.name,
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

	async getUserIdByName(name: string) {
		try {
			const user = await this.prisma.user.findFirst({
				where: { name: name, },
				select: { id: true, },
			});
			return (user.id);
		} catch (error) {
			console.log("getUserByName error: ", error);
		}
	}

	async	new_message(data: MessageDTO) {
		try {
			const id = await this.getUserIdByMail(data.email); // Get user id by email
			/* function isMuted() is not working :
			const isMuted = await this.isMuted(id, data.channelId); // Check if user is muted
			if (isMuted.length !== 0) return ; // If user is muted, message is not created
			*/
			console.log("id::: ", id);
			await this.prisma.channel.update({ 
				where: { id: data.channelId },
				data: {
					members: {
						connect: {id: id}
					}
				}});
			const message = await this.prisma.message.create({
				data: {
					content: data.message,
					history: [data.message],
					owner: { connect: { email: data.email } },
					channel: { connect: { id: data.channelId } },
				}
			});
			// Fill missing infos, which aren't in messageDTO.
			await this.prisma.message.update({
				where: { id: message.id, },
				data: {
					updatedAt: message.createdAt, // remove it from db (useless)
					userId: id,
					channelId: data.channelId
				},
			});
			await this.prisma.channel.update({ where: { id: data.channelId }, data: { updatedAt: new Date() } });
			return message?.id;
		}
		catch (error) { throw new WsException(error.message); }
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

	async	create_channel(info: ChannelDTO) {
		try {
			const password = info.password ? await argon.hash(info.password) : null;
			const channel = await this.prisma.channel.create({  
				data: {
					name: info.name,
					private: info.dm,
					isProtected: info.isProtected,
					password: password,
					owners : { connect: { email: info.email, }, },
					admins : { connect: { email: info.email, }, },
				},
			});
			this.prisma.channel.update({ where: { id: channel.id }, data: { updatedAt: new Date() } });
			return channel.id;
		} catch (error) {
			console.log("Failed to create new channel: ", error);
			throw new WsException(error);
		}
	}

	async addNewChannelMember(channelId: number) {
		try {
				const allUsers = await this.prisma.user.findMany();
				const connectUsersTochannel = allUsers.map((user) => {
					return this.prisma.channel.update({
						where: { id : channelId },
						data: {
							members: {
								connect: { id: user.id },
							},
						},
		})});
		await this.prisma.$transaction(connectUsersTochannel);
		}
		 catch (error) {
			console.log('addNewChannelMenmber error:', error);
			throw new WsException(error);
		}
	}

	async channelAlreadyExists(ownerId1, ownerId2) {
		const existingChannel = await this.prisma.channel.findFirst({
			where: { dm: true, NOT: { owners: { some: { AND: [{ id: ownerId1 }, { id: ownerId2 }] } } } }
		});
		
		console.log("🚀 ~ file: chat.service.ts:270 ~ ChatService ~ channelAlreadyExists ~ existingChannel:", existingChannel !== null ? true : false);
		return  existingChannel !== null ? true : false; // Retourne true si un canal existe, sinon false
	}

	async create_mp(creator: string, otherClient: ChannelDTO) {
		try {
			let ids: number[] = []; 
			const ownerId = await this.getUserIdByName(creator);
			const otherId = await this.getUserIdByName(otherClient.name);
			const channelAlreadyExists = await this.channelAlreadyExists(ownerId, otherId);
			if (channelAlreadyExists) return null; 
			ids.push(ownerId, otherId);
			const channel = await this.prisma.channel.create({  
				data: {
					name: otherClient.name,
					private: true,
					dm: true,
					isProtected: otherClient.isProtected,
					password: '',
					owners : { connect: ids.map((id) => ({ id: id })) },
				},
			}); 
			this.prisma.channel.update({ where: { id: channel.id }, data: { updatedAt: new Date() } });
			return channel.id;
		} catch (error) { console.log("Failed to create new channel: ", error); }
	}

	async	get_channels() { 
		return await this.prisma.channel.findMany( { where: { dm: false }});}
	async	get_channels2(userId: number) { 
		return await this.prisma.channel.findMany({ 
			where: { 
				dm: false,
			NOT: {
				banned: { 
					some: { 
						id: userId, 
					},
				},
			}, 
		}, 
	}); 
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
							name: true
						}
					},
					messages: {
						where: { unsent: false, },
						orderBy: { createdAt: 'asc', },
						select: { content: true, },
						take: 1
					}
				}
			});
			return channel;
		} catch (error) {
			console.log('get_channel_by_id error:', error);
			throw new WsException(error);
		}
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
