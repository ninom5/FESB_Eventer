function ProfileActions({ isEditing, handleEdit, handleSave, handleCancel }) {
  return (
    <div className="profile-actions">
      {isEditing ? (
        <>
          <button onClick={handleSave} className="saveButton">
            Save Changes
          </button>
          <button onClick={handleCancel} className="cancelButton">
            Cancel
          </button>
        </>
      ) : (
        <button onClick={handleEdit} className="editButton">
          Edit Profile
        </button>
      )}
    </div>
  );
}

export default ProfileActions;
