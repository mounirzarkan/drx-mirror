import React from 'react';

const AccountDetails = (props) => {
  // console.log("INCOMING FROM SC");
  // console.log("-----------------------------------");
  // console.log(props);

  //let config = mapper.ViewOrderData(props);

  return (
    <div style={{ backgroundColor: "#EAE4E9", padding: "15px", margin: "10px 0" }}>
      <b>Acount</b>
      <hr />

      <ul>
        <li><b>component:</b>{props.rendering.componentName}</li>
        <li><b>datasource:</b> {props.rendering.dataSource}</li>
      </ul>

    </div>
  );

}

export default AccountDetails;
