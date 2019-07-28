import React from 'react';
import './Tile.css';
import tile00 from '../../assets/00.jpg';
import tile01 from '../../assets/01.jpg';
import tile02 from '../../assets/02.jpg';
import tile03 from '../../assets/03.jpg';
import tile04 from '../../assets/04.jpg';
import tile05 from '../../assets/05.jpg';
import tile06 from '../../assets/06.jpg';
import tile11 from '../../assets/11.jpg';
import tile12 from '../../assets/12.jpg';
import tile13 from '../../assets/13.jpg';
import tile14 from '../../assets/14.jpg';
import tile15 from '../../assets/15.jpg';
import tile16 from '../../assets/16.jpg';
import tile22 from '../../assets/22.jpg';
import tile23 from '../../assets/23.jpg';
import tile24 from '../../assets/24.jpg';
import tile25 from '../../assets/25.jpg';
import tile26 from '../../assets/26.jpg';
import tile33 from '../../assets/33.jpg';
import tile34 from '../../assets/34.jpg';
import tile35 from '../../assets/35.jpg';
import tile36 from '../../assets/36.jpg';
import tile44 from '../../assets/44.jpg';
import tile45 from '../../assets/45.jpg';
import tile46 from '../../assets/46.jpg';
import tile55 from '../../assets/55.jpg';
import tile56 from '../../assets/56.jpg';
import tile66 from '../../assets/66.jpg';
import back from '../../assets/back.jpg';
const tile = (props) => {
  let src;

  switch (props.tileName) {
    case ("00"):
      src = tile00;
      break;
    case ("01"):
      src = tile01;
      break;
    case ("02"):
      src = tile02;
      break;
    case ("03"):
      src = tile03;
      break;
    case ("04"):
      src = tile04;
      break;
    case ("05"):
      src = tile05;
      break;
    case ("06"):
      src = tile06;
      break;
    case ("11"):
      src = tile11;
      break;
    case ("12"):
      src = tile12;
      break;
    case ("13"):
      src = tile13;
      break;
    case ("14"):
      src = tile14;
      break;
    case ("15"):
      src = tile15;
      break;
    case ("16"):
      src = tile16;
      break;
    case ("22"):
      src = tile22;
      break;
    case ("23"):
      src = tile23;
      break;
    case ("24"):
      src = tile24;
      break;
    case ("25"):
      src = tile25;
      break;
    case ("26"):
      src = tile26;
      break;
    case ("33"):
      src = tile33;
      break;
    case ("34"):
      src = tile34;
      break;
    case ("35"):
      src = tile35;
      break;
    case ("36"):
      src = tile36;
      break;
    case ("44"):
      src = tile44;
      break;
    case ("45"):
      src = tile45;
      break;
    case ("46"):
      src = tile46;
      break;
    case ("55"):
      src = tile55;
      break;
    case ("56"):
      src = tile56;
      break;
    case ("66"):
      src = tile66;
      break;
    default:
      src = back;
  }

  let classes = [props.classes, props.isActive, "Tile"];
  let classesString = classes.join(" ");

  let styles;
  if (props.classes !== undefined) {
    styles = {
      position: "absolute",
      left: props.xPos,
      top: props.yPos
    };
  }

    return (
      <img
        id={props.tileName}
        className={classesString}
        src={src}
        style={styles}
        alt="tile"
        onClick={props.click}
      />
    );
};

export default tile;