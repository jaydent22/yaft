import Modal from "../Modal";

const ExerciseDayModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean,
    onClose: () => void,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <h2 className="text-xl font-semibold mb-4">Exercise Day Details</h2>
                <p>Here you can edit the details of the exercise day.</p>
            </div>
        </Modal>
    );
}

export default ExerciseDayModal;