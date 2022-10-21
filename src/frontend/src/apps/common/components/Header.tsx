import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonImg,
  IonRouterLink,
} from "@ionic/react";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";

import styled from "styled-components";
import Backarrow from "../../../assets/common/backarrow.png";
import Logo from "../../../assets/logo.png";

import routeContextAtom from "../state/routeContext";
interface IHeader {
  type?: "default" | "back" | "title";
  text?: string;
  routeTo?: string;
  onHeaderClick?: () => void;
}
const Header = ({ text, type, routeTo, onHeaderClick }: IHeader) => {
  const history = useHistory();
  const [routeContext, setRouteContextState] = useRecoilState(routeContextAtom);
  return (
    <IonHeader
      style={{
        height: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      className="ion-no-border"
    >
      <IonToolbar color="light">
        {["default", undefined].includes(type) ? (
          <IonButtons style={{ justifyContent: "center" }}>
            {" "}
            &nbsp; <IonImg style={{ height: "25px" }} src={Logo} />
          </IonButtons>
        ) : type === "back" ? (
          <>
            <IonButtons slot="start">
              <IonButton
                routerLink={
                  routeContext.length > 1
                    ? routeContext[routeContext.length - 2]
                    : routeContext[0]
                }
                onClick={() => {
                  if (routeContext.length > 1) {
                    setRouteContextState(
                      routeContext.slice(0, routeContext.length - 1)
                    );
                  }
                }}
                routerDirection="back"
              >
                {" "}
                <img
                  style={{ width: "24px", height: "24px" }}
                  src={Backarrow}
                  alt="back-arrow"
                />
              </IonButton>
            </IonButtons>
            <TextDiv>{text}</TextDiv>
          </>
        ) : type === "title" ? (
          <div
            style={{
              height: "60px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <TextDiv style={{ margin: "0px" }}>{text}</TextDiv>
          </div>
        ) : (
          ""
        )}
      </IonToolbar>
    </IonHeader>
  );
};

const TextDiv = styled.div`
  font-family: "Pretendard";
  font-weight: bolder;
  font-style: normal;
  font-size: 20px;
  color: #111111;
  margin: 0px 0px 0px 16px;
`;

export default Header;
