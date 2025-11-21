import React from "react";

const Typography: React.FC<any> = ({ as: Tag = 'span', children, className }) => <Tag className={className}>{children}</Tag>;

export default Typography;
