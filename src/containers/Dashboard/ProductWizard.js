'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProductWizard extends Component {
    render() {
        return (
            <div>
                <h1>Add Your Product!</h1>
            </div>
        );
    }
}

export default connect()(ProductWizard);
