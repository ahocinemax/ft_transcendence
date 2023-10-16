import React from 'react';
import './Profile.css';
import SettingsIcon from '../../Settings_Icon.png';

const Profile = () => {
  return (
    <div className="profile">
		<div className="bande">
            <div className="profile_img"></div>
            <div className="profile_info">
                <h1 className="info">#playerPseudo</h1>
                <h1 className="info">#whichTeam?</h1>
                <h1 className="info">#Score?</h1>
                <h1 className="info">#Rank?</h1>
            </div>
            <a href="/settings" className="nav-link_profile"><img src={SettingsIcon} alt="Logo 5" /></a>
        </div>
        <div className="centered_div_container">
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Games</h1>
                    <h1 className="stat">42</h1>
                </div>
            </div>
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Wins</h1>
                    <h1 className="stat">42</h1>
                </div>
            </div>
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Winrate</h1>
                    <h1 className="stat">100%</h1>
                </div>
            </div>
        </div>
        <div className='friendlist'>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player2</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player3</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player4</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player6</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player7</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player8</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player9</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player10</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
        </div>
        <div className='match_history'>
            <div className='win'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Hard Mode</div>
                <div className='match_infos'>Win</div>
            </div>
            <div className='loose'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Normal Mode</div>
                <div className='match_infos'>Loose</div>
            </div>
            <div className='win'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Hard Mode</div>
                <div className='match_infos'>Win</div>
            </div>
            <div className='loose'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Normal Mode</div>
                <div className='match_infos'>Loose</div>
            </div>
            <div className='win'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Hard Mode</div>
                <div className='match_infos'>Win</div>
            </div>
            <div className='loose'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Normal Mode</div>
                <div className='match_infos'>Loose</div>
            </div>
            <div className='win'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Hard Mode</div>
                <div className='match_infos'>Win</div>
            </div>
            <div className='loose'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Normal Mode</div>
                <div className='match_infos'>Loose</div>
            </div>
            <div className='win'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Hard Mode</div>
                <div className='match_infos'>Win</div>
            </div>
            <div className='loose'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Normal Mode</div>
                <div className='match_infos'>Loose</div>
            </div>
            
        </div>
    </div>
  );
}

export default Profile;
