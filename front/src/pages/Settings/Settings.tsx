import React, { useState, useRef, useEffect } from 'react';
import './Settings.css';
import { backFunctions } from '../../outils_back/BackFunctions';
import { useUserContext } from '../../context/userContent';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const { userName, lost, image, setImage, doubleAuth, setDoubleAuth, setUserName} = useUserContext();
  const [is2FAEnabled, setIs2FAEnabled] = useState(doubleAuth.doubleAuth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pseudo, setPseudo] = useState(''); // État pour stocker le pseudo
  const [newPseudo, setNewPseudo] = useState(''); // État pour stocker le nouveau pseudo
  const { setEmail, setVerified2FA } = useUserContext(); 
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [inputCode, setInputCode] = useState(''); 

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCode(event.target.value);
  };

  const toggle2FA = async () => {
    if (doubleAuth.doubleAuth) {
      // si 2FA est activé, on le désactive
      try {
        const user = { name: userName.userName };
        const response = await backFunctions.disableTwoFactor(user);
        if (response.message === 'OK') {
          console.log('2FA disabled successfully.');
          setDoubleAuth({doubleAuth:false});
          setIs2FAEnabled(false);
        } else {
          console.log('Failed to disable 2FA.');
        }
      } catch (error) {
        console.error('Failed to disable 2FA:', error);
      }
    } else {
      // si 2FA est désactivé, on l'active 
      setIsModalOpen(true);
      try {
        const user = { mail:'mtsuji@student.42.fr', otp_enabled: false, otp_validated: false, otp_verified: false };
        const response = await backFunctions.sendMailTwoFactor({name: userName.userName});
        console.log('2FA mail sent:', response);
      } catch (error) {
        console.error('Failed to send 2FA mail:', error);
      }
    }
  };
  const closeModal = async () => {
    if (!doubleAuth.doubleAuth) {
      try {
        const user = { hash: inputCode, name: userName.userName};  // on stock le code et le pseudo dans un objet
        const response = await backFunctions.confirmCodeForTwoFactor(user);
        if (response.message === 'OK') {  // si c'est bon, on renvoit un message OK
          console.log('2FA code verified successfully.');
          setIsModalOpen(false);
          setDoubleAuth({doubleAuth:true});
          setIs2FAEnabled(true);
        } else {
          console.log('Failed to verify 2FA code.');
        }
      } catch (error) {
        console.error('An error occurred while verifying the 2FA code:', error);
      }
    }
  };

  function isAlphanum(inputString: string) {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(inputString);
  }

  const handlePseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Mettre à jour l'état du pseudo lorsque l'utilisateur modifie le champ de saisie => Temp avec le back?
    if (pseudo.length >= 3 && pseudo.length <= 12 && isAlphanum(pseudo))
        setPseudo(event.target.value);
    /* else
        setPseudo(pseudo); */
  };

  const handleNewPseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Mettre à jour l'état du nouveau pseudo lorsque l'utilisateur modifie le champ de saisie => Temp avec le back?
    setNewPseudo(event.target.value);
  };

  const updatePseudo = async () => {
    // Mettre à jour le pseudo avec le nouveau pseudo saisi
    if (newPseudo.length >= 3 && newPseudo.length <= 12 && isAlphanum(newPseudo))
        setPseudo(newPseudo);
    try {
          const updatedUser = await backFunctions.updateUser(userName.userName, { name: newPseudo, isRegistered: true });
          if (updatedUser) {
            console.log("User updated successfully:", updatedUser);
            setUserName({userName: newPseudo});
            navigate('/profile');
          }
        } catch (error) {
          console.error("Failed to update user:", error);
        }
    setNewPseudo(''); // Réinitialiser le champ de saisie
  };

  /* const { userName, games, image, } = useUserContext() */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      if (file.type === 'image/jpeg' || file.type === 'image/png'|| file.type === 'image/webp')
      {
        setSelectedImage(file);
        //convert file to base64 string
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImage({ image: reader.result as string });
          console.log('Image uploaded:', reader.result as string);
          const updateUserImage = backFunctions.updateUser(userName.userName, { image: reader.result as string });
          if (updateUserImage)
          {
            console.log("Image updated successfully:", updateUserImage);
            setImage({ image: reader.result as string }); 
            //navigate('/profile');
          }
          console.log('Image', image.image);
        };
      }
      else
        alert("You need to upload either a .jpg, .jpeg or .png file");
    }
  };

  const openImageUploader = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const roundDivSettingsImgStyle = {
    backgroundImage: selectedImage ? `url(${URL.createObjectURL(selectedImage)})` : '',
  };

  useEffect(() => {
    // ここで doubleAuth の状態をサーバーから取得する処理を書く
    async function fetchDoubleAuthStatus() {
      try {
        const response = await backFunctions.getUserByToken();
        console.log('2FA status:', response.otp_enabled);
        setDoubleAuth({ doubleAuth: response.otp_enabled });
        setIs2FAEnabled(response.otp_enabled);
        setUserName({ userName: response.name });
        setImage({ image: response.image });
        setDoubleAuth({ doubleAuth: response.otp_enabled });
        setIs2FAEnabled(response.otp_enabled);
      } catch (error) {
        console.error('Failed to get 2FA status:', error);
      }
    }
  
    fetchDoubleAuthStatus();
  }, []);


  return (
    <div className="settings" onClick={closeModal}>
      <h1 className="Settingsh1">Settings</h1>
      <div className="settings_container">
        <div className="round_div_settings_img" onClick={openImageUploader} style={{ backgroundImage: `url(${image.image})` }}></div>
        <p className="info_settings">{userName.userName}</p> {/* Afficher le pseudo actuel, faudrait prendre celui du back */}
        <p className="info_settings"></p>
        <div className="twofa_container">
          <span
            className={`twoFA_status ${!is2FAEnabled ? 'clickable' : ''}`}
            onClick={toggle2FA}
          >
            {is2FAEnabled ? '2FA Activé' : '2FA Désactivé'}
          </span>
          <div className={`switch ${is2FAEnabled ? 'active' : ''}`} onClick={toggle2FA}>
            <div className="switch-button"></div>
          </div>
        </div>
      </div>

      {/* Swap image */}
          <div className="change_nick_input"> 
         <input 
              type="file"
              ref={imageInputRef}
              accept=".jpg, .jpeg, .png, webp"
              style={{ display: 'none' }}
              onChange={handleImageChange}/>
         </div> 
{/*  */}
      {/* Swap nickname */}
      <div className="change_nick_input">
        <input
          type="text"
          className="change_nick_input"
          value={newPseudo}
          onChange={handleNewPseudoChange}
          placeholder="Change nickname"
        />
        <button className="change_pseudo_button" onClick={updatePseudo}>Changer le pseudo</button>
      </div>

      {/* PopUp */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <p className="info_tiny">Enter the code received by e-mail to enable 2FA :</p>
            <input type="number" placeholder="Code" onChange={handleCodeChange}/>
            <button className="popup_enter_button" onClick={closeModal}>Enter</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;