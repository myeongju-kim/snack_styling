import { IonContent, IonPage, IonRouterLink } from "@ionic/react";
import Header from "../../common/components/Header";
import useStyleQDetail from "../hooks/useStyleQDetail";
import StyleQCardDetail from "../components/StyleQCardDetail";
import StyleAnsCard from "../components/StyleAnsCard";
import ListDiv from "../../common/components/ListDiv";
import { RouteComponentProps } from "react-router";
import useTabBarControl from "../../common/hooks/useTabBarControl";
import BottomButton from "../../common/components/BottomButton";
import Plus from "../../../assets/common/plus.svg";
import RowFiller from "../../common/components/RowFiller";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../common/state/user";
import { ADOPT_ANSWER, DELETE_QUESTION } from "../../../lib/api/styleQ";
import { useHistory } from "react-router-dom";
import { styleQState } from "../state/styleQ";
type IStyleQDetail = RouteComponentProps<{ id: string }>;

const StyleQDetail = ({ match }: IStyleQDetail) => {
  const [styleQs, setStyleQs] = useRecoilState(styleQState);
  const history = useHistory();
  const { styleQDetailData, removeAnswer } = useStyleQDetail(
    Number(match.params.id)
  );
  const { id } = useRecoilValue(userAtom);
  useTabBarControl("useUnmount");
  const removeQ = async () => {
    if (!styleQDetailData?.que.qid) return;
    await DELETE_QUESTION(styleQDetailData?.que.qid);
    setStyleQs(
      styleQs.filter((elem) => elem.qid !== styleQDetailData?.que.qid)
    );
    history.push("/styleQ");
    const tabbar = document.querySelector("ion-tab-bar");
    const fabButton = document.querySelector("ion-fab");
    if (tabbar !== null) tabbar.style.display = "flex";
    if (fabButton !== null) fabButton.style.display = "flex";
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

        {id === styleQDetailData?.que.mid &&
        styleQDetailData.ans.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <span onClick={removeQ}> 삭제하기 </span> &nbsp; | &nbsp;{" "}
            <IonRouterLink
              routerLink={`/apply/update/${styleQDetailData?.que.qid}`}
            >
              <span> 수정하기 </span>
            </IonRouterLink>
          </div>
        ) : (
          false
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
          답변하기
        </IonButton> */}
        {adoptedAns === -1 && (
          <>
            <RowFiller px={70} />

            <BottomButton>
              <IonRouterLink
                // onClick={() => {
                //   window.location.href = `/codiShowcase/create/${styleQDetailData?.que.mid}/${styleQDetailData?.que.qid}`;
                // }}
                routerLink={`/codiShowcase/create/${styleQDetailData?.que.mid}/${styleQDetailData?.que.qid}/-1`}
              >
                <div style={{ color: "white" }}>
                  <img
                    style={{
                      margin: "0px 10px",
                      position: "relative",
                      top: "1px",
                    }}
                    src={Plus}
                  />
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    스타일링 답변하기
                  </span>
                </div>
              </IonRouterLink>
            </BottomButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default StyleQDetail;
