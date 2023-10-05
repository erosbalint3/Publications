import "./Profile.css";

const displayChangePasswordPopup = () => {
    if (document.getElementById("changePasswordPopup")!.style.display === "none") {
        document.getElementById("changePasswordPopup")!.style.display = "flex";
    } else {
        document.getElementById("changePasswordPopup")!.style.display = "none";
    }
}

const Profile = () => {
    return (
        <div id="profileMain">
            <div id="headerButtons">
                <button>Update profile</button>
                <button>Delete profile</button>
            </div>
            <div id="profileInfo">
                <div id="profilePicture">
                    <img src="https://i.imgur.com/YxABR43.jpeg" alt="Profile picture" />
                </div>
                <div id="profileText">
                    <h1>Username</h1>
                    <div>
                        <p>First name: </p>
                        <input type="text" />
                    </div>
                    <div>
                        <p>Last name: </p>
                        <input type="text" />
                    </div>
                    <div>
                        <p>Email: </p>  
                        <input type="text" />
                    </div>
                </div>
            </div>
            <div id="mainChangePasswordPart">
                <div id="changePasswordButton">
                    <button onClick={displayChangePasswordPopup}>Change password</button>
                </div>
                <div id='changePasswordPopup'>
                    <div id="changePasswordPopupContent">
                        <div id="changePasswordPopupBody">
                            <h1>Change password</h1>
                            <div id="changePasswordPopupBodyText">
                                <p>Current password: </p>
                                <input type="password" />
                            </div>
                            <div id="changePasswordPopupBodyText">
                                <p>New password: </p>
                                <input type="password" />
                            </div>
                            <div id="changePasswordPopupBodyText">
                                <p>Confirm new password: </p>
                                <input type="password" />
                            </div>
                        </div>
                        <div id="changePasswordPopupFooter">
                            <button onClick={displayChangePasswordPopup}>Close</button>
                            <button>Change password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;