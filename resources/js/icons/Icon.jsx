import React, { Suspense } from 'react';
import * as Icons from './index';

const Icon = ({ name, className = '' }) => {
    const IconComponent = Icons[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found.`);
        return null;
    }

    const defaultClasses = 'h-5 w-5';

    return (
        <Suspense fallback={null}>
            <IconComponent className={`${defaultClasses} ${className}`} />
        </Suspense>
    );
};

export default Icon;
