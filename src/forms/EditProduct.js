import { reduxForm } from 'redux-form';
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function EditProduct({
    fields: { name, description },
    handleSubmit,
    submitting,
}) {
    return (<form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="adTitle-input">Title</label>
            <input {...name} type="text" id="adTitle-input" className="form-control" />
        </div>
        <div className="form-group">
            <label htmlFor="adDesc-textarea">Description</label>
            <textarea {...description} className="form-control" id="adDesc-textarea" rows={3} />
        </div>
        <div className="form-group">
            <label htmlFor="addVideo-modal">Add Video (optional)
                &nbsp;
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>
                        You can promote your app using your YouTube video
                    </Tooltip>}
                >
                    <i className="fa fa-question-circle" aria-hidden="true" />
                </OverlayTrigger>
            </label><br />
            <a href="#">
                http://youtube.com/xyzS4sd/astra-trasst-astar
            </a>
            <div role="toolbar" className="btn-toolbar">                
                <div className="clearfix"></div>
                {/* Hide this button when there is an existing video tied to the app campaign*/}
                <button className="btn btn-primary">
                    <i className="fa fa-file-video-o" aria-hidden="true"></i> Add Video
                </button>
                
                {/* Show these buttons when video has already been added to the app campaign
                <button className="btn btn-primary">
                    <i className="fa fa-file-video-o" aria-hidden="true"></i> Edit Video
                </button>
                <button className="btn btn-primary">
                    <i className="fa fa-trash-o" aria-hidden="true"></i> Delete Video
                </button>
                */}
            </div>            
            {/*
                <div>                
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header text-center">
                            <button onClick={handleClose} className="close" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h1 className="modal-title" id="addVideo-modal">Add Your Video</h1>
                        </div>
                        <div className="modal-body text-center">
                            <div className="input-group">
                              <input type="text" 
                                className="form-control" placeholder="Paste YouTube link..." />
                              <span className="input-group-btn input-group-btn-primary">
                                <button className="btn btn-primary" type="button">Add</button>
                              </span>                      
                            </div>
                            <span id="helpBlock" className="help-block">Video should be under 60 seconds.
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>
                                        Short and sweet delivers better ad performance and more leads.
                                    </Tooltip>}
                                ><a href="#">Why?</a>
                                </OverlayTrigger>
                            </span>
                            <div className="embed-responsive embed-responsive-16by9">
                                <iframe 
                                    className="embed-responsive-item"
                                    width="560"
                                    height="315"
                                    src="https://www.youtube.com/embed/MWmbLpeoLZA"
                                    frameborder="0"
                                    allowfullscreen>
                                </iframe>
                            </div>
                            <div className="clearfix"></div>
                            <br />
                            <div className="form-group">
                                <button className="btn btn-primary btn-lg">
                                    Promote this video
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            */}
        </div>
        <button
            type="submit"
            className={classnames('col-sm-6 col-xs-12 btn btn-danger btn-lg', {
                'btn-waiting': submitting,
            })}
        >
            Next
        </button>
    </form>);
}

EditProduct.propTypes = {
    fields: PropTypes.shape({
        name: PropTypes.object.isRequired,
        description: PropTypes.object.isRequired,
    }).isRequired,
    submitting: PropTypes.bool.isRequired,

    handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
    form: 'productWizard',
    fields: ['name', 'description'],
    destroyOnUnmount: false,
})(EditProduct);
