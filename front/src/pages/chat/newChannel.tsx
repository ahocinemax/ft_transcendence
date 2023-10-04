import { useState } from "react";
import { Tag, newChannelType } from "./chat.type";
import Switch from "react-switch";
import { socket } from "../App";

export function NewChannel({newChannelRequest, onNewChannelRequest, updateStatus} : {
                            newChannelRequest: boolean,
                            onNewChannelRequest: () => void,
                            updateStatus: number}) {
    const email = localStorage.getItem("userEmail");
    const [userTag, setUserTag] = useState<Tag[]>([]);
    const [roomName, setRoomName] = useState("");
    const [roomPass, setRoomPass] = useState("");
    const [isPrivate, setPrivate] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [addedMember, setAddMember] = useState<Tag[]>([]);

    const createNewChannel = () => {
        let data: newChannelType = {
            name: roomName,
            private: isPrivate,
            isPassword: isPassword,
            password: roomPass,
            email: email,
            members: addedMember,
        }
        console.log(data);
        socket.emit("new channel", data, (data: newChannelType) => {
            socket.emit('fetch new channel', data);
        });
        initVars();
    }

    const initVars = () => {
        setRoomName("");
        setAddMember([]);
        setPrivate(false);
        setIsPassword(false);
        setRoomPass("");
    }

    const handleString = (value: string, setValue: (value: string) => void) => {
        setValue(value);
    }

    const handlePrivate = () => {
        setPrivate(old => {return !old});
    }

    const handleIsPassword = () => {
        setIsPassword(old => {return !old});
    }

    return (
    <div >
        <div>CREATE ROOM</div>
        <div>
          <input
            value={roomName}
            onChange={(e) => handleString(e.target.value, setRoomName)}
            placeholder="NAME"
          />
        </div>
        <div className="div-switch">
          <label style={{ color: isPrivate ? "rgb(0,136,0)" : "grey" }}>
            private
          </label>
          <Switch
            className="switch"
            onChange={handlePrivate}
            checked={isPrivate}
            checkedIcon={false}
            uncheckedIcon={false}
          />
        </div>
        <div className="div-switch">
          <label style={{ color: isPassword ? "rgb(0,136,0)" : "grey" }}>
            password
          </label>
          <Switch
            className="switch"
            onChange={handleIsPassword}
            checked={isPassword}
            checkedIcon={false}
            uncheckedIcon={false}
          />
        </div>
        <div style={{ display: isPassword ? "" : "none" }}>
          <input
            type="password"
            value={roomPass}
            onChange={(e) => handleString(e.target.value, setRoomPass)}
            className="password"
          />
        </div>
        <div className="flex-block"></div>
        <div onMouseUp={createNewChannel} className="card-confirm-button">
          CONFIRM
        </div>
      </div>
    );
}