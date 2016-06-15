import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import classnames from 'classnames';

export default function Alert({
    onDismiss,
    onSelect,

    alert: { id: alertId, title, description, buttons },
}) {
    return (<Modal show bsSize="small" onHide={() => onDismiss()}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        {description && (<Modal.Body>
            <p>{description}</p>
        </Modal.Body>)}
        <Modal.Footer>
            {buttons.map(({ id: buttonId, type, text, submitting }) => <Button
                key={buttonId}
                bsClass={classnames('btn', {
                    'btn-waiting': submitting,
                })}
                disabled={submitting}
                bsStyle={type}
                onClick={() => onSelect({ alert: alertId, button: buttonId })}
            >
                {text}
            </Button>)}
        </Modal.Footer>
    </Modal>);
}

Alert.propTypes = {
    onDismiss: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,

    alert: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.node,
        buttons: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            type: PropTypes.string,
            text: PropTypes.string.isRequired,
        }).isRequired).isRequired,
    }).isRequired,
};
