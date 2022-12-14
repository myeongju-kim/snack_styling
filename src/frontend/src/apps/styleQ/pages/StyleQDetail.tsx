import { IonButton, IonContent, IonPage, IonRouterLink } from "@ionic/react";
import Header from "../../common/components/Header";
import useStyleQDetail from "../hooks/useStyleQDetail";
import StyleQCardDetail from "../components/StyleQCardDetail";
import StyleAnsCard from "../components/StyleAnsCard";
import ListDiv from "../../common/components/ListDiv";
import { RouteComponentProps } from "react-router";
import BottomButton from "../../common/components/BottomButton";
import Plus from "../../../assets/common/plus.svg";
import RowFiller from "../../common/components/RowFiller";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../../common/state/user";
import { ADOPT_ANSWER, DELETE_QUESTION } from "../../../lib/api/styleQ";
import { useHistory } from "react-router-dom";
import { styleQState } from "../state/styleQ";
import routeContextAtom from "../../common/state/routeContext";
import RoutingLink from "../../common/components/RoutingLink";

type IStyleQDetail = RouteComponentProps<{ id: string }>;

const StyleQDetail = ({ match }: IStyleQDetail) => {
  const setRouteContextState = useSetRecoilState(routeContextAtom);
  const setStyleQs = useSetRecoilState(styleQState);
  const history = useHistory();
  const { styleQDetailData, removeAnswer, error } = useStyleQDetail(
    Number(match.params.id)
  );
  const { id } = useRecoilValue(userAtom);
  const removeQ = async () => {
    if (!styleQDetailData?.que.qid) return;
    const res = await DELETE_QUESTION(styleQDetailData?.que.qid);
    if (res.status === 200) {
      setStyleQs((state) =>
        state.filter((elem) => elem.qid !== styleQDetailData?.que.qid)
      );
      history.push("/styleQList");
      setRouteContextState(() => ["/styleQList"]);
    }
  };

  const adoptAns = async (aid: number) => {
    await ADOPT_ANSWER(aid);
    window.location.reload();
  };

  const adoptedAns = styleQDetailData?.ans.findIndex(
    (elem) => elem.adopt === 1
  );

  return (
    <IonPage>
      <IonContent>
        <Header type="back" routeTo="/styleQ" />
        {styleQDetailData?.que === undefined && !error && <div>loading</div>}
        {error && <div>?????? ???????????? ????????????.</div>}
        {id === styleQDetailData?.que.mid &&
          styleQDetailData.ans.length === 0 &&
          adoptedAns === -1 && (
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <span onClick={removeQ}> ???????????? </span> &nbsp; | &nbsp;{" "}
              <IonRouterLink
                routerLink={`/apply/update/${styleQDetailData?.que.qid}`}
              >
                <span> ???????????? </span>
              </IonRouterLink>
            </div>
          )}
        <StyleQCardDetail styleQ={styleQDetailData?.que} />

        <ListDiv>
          {styleQDetailData?.ans.map((ans, idx) => {
            // if (idx === adoptedAns) return;
            return (
              <StyleAnsCard
                adopted={idx === adoptedAns}
                showAdopt={
                  id === styleQDetailData?.que.mid && adoptedAns === -1
                }
                onClickAdopt={() => {
                  adoptAns(ans.aid);
                }}
                key={ans.aid}
                styleAns={ans}
                owner={id === ans.mid}
                onClickDelete={
                  id === ans.mid ? () => removeAnswer(ans.aid) : undefined
                }
                onClickUpdate={
                  id === ans.mid
                    ? () =>
                        history.push(
                          `/codiShowCase/update/${styleQDetailData?.que.mid}/${styleQDetailData?.que.qid}/${ans.codi.id}`
                        )
                    : undefined
                }
              />
            );
          })}
        </ListDiv>
        {/* <IonButton
          expand="block"
          routerLink={`/codiShowcase/${styleQDetailData?.que.mid}/${styleQDetailData?.que.qid}`}
        >
          ????????????
        </IonButton> */}
        {adoptedAns === -1 && styleQDetailData?.que.mid !== id && (
          <>
            <RowFiller px={70} />

            <BottomButton>
              <RoutingLink
                routerLink={`/codiShowcase/create/${styleQDetailData?.que.mid}/${styleQDetailData?.que.qid}/-1`}
              >
                <IonButton
                  color={"primary"}
                  style={{ width: "100%" }}
                  expand="full"
                >
                  <div style={{ color: "white" }}>
                    <img
                      style={{
                        margin: "0px 10px",
                        position: "relative",
                        top: "1px",
                        fontWeight: 200,
                      }}
                      src={Plus}
                    />
                    <span style={{ fontSize: "16px" }}>???????????? ????????????</span>
                  </div>
                </IonButton>
              </RoutingLink>
            </BottomButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default StyleQDetail;
