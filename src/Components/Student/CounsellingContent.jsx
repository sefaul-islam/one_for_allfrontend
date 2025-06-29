import React from 'react';
import JoinCounselling from './counselling/JoinCounselling';
import MyCounselling from './counselling/MyCounselling';

const COUNSELLING_COMPONENTS = {
  join: JoinCounselling,
  my: MyCounselling,
};

const CounsellingContent = ({ counsellingOption }) => {
  const Component = COUNSELLING_COMPONENTS[counsellingOption] || (() => null);
  return <Component />;
};

export default CounsellingContent; 