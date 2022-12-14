import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router";
import useSignin from "../hooks/useSignin";
import { validEmail, validPwd } from "../../../lib/utils/validation";
import Header from "../../common/components/Header";
import BottomButton from "../../common/components/BottomButton";
import RowFiller from "../../common/components/RowFiller";
import Label from "../../common/components/Label";
import Button from "../../common/components/Button";
import Notification from "../../common/components/Notification";

const Signin = () => {
  const history = useHistory();
  const [errorEmailMessage, setErrorEmailMessage] = useState("");
  const {
    id,
    setId,
    pwd,
    setPwd,
    pwd2,
    setPwd2,
    code,
    setCode,
    verification,
    emailSend,
    emailConfirm,
    postSignin,
    errorMessage,
  } = useSignin();

  return (
    <IonPage>
      <Header type="back" text="회원가입" />
      <IonContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (verification !== 1) {
              setErrorEmailMessage("이메일 인증을 진행해 주세요");
              return;
            }

            if (!validEmail(id)) {
              setErrorEmailMessage("이메일 형식이 맞지 않습니다");
              return;
            }
            if (!validPwd(pwd)) {
              setErrorEmailMessage("비밀번호 형식이 맞지 않습니다.");
              return;
            }
            if (pwd !== pwd2) {
              setErrorEmailMessage("비밀번호가 서로 다르게 입력되었습니다.");
              return;
            }
            postSignin.subscribe({
              complete() {
                history.push("/memberDetailRegist");
              },
            });

            setErrorEmailMessage("");
          }}
        >
          <IonList>
            <RowFiller px={15} />
            <Label text="이메일" />

            <IonInput
              autofocus
              value={id}
              placeholder="아이디를 입력해 주세요"
              onIonChange={(e) => setId(e.detail.value!)}
              type="email"
              maxlength={50}
              clearInput
              required
              disabled={verification !== -1}
            />

            <RowFiller px={8} />
            {verification === -1 && (
              <IonButton expand="full" onClick={emailSend}>
                이메일 확인
              </IonButton>
            )}
            {verification !== -1 && (
              <>
                <IonRow>
                  <IonInput
                    type="number"
                    onIonChange={(e) => setCode(Number(e.detail.value!))}
                    value={code}
                    disabled={verification === 1}
                  ></IonInput>
                  <IonButton
                    disabled={verification === 1}
                    onClick={emailConfirm}
                  >
                    인증하기
                  </IonButton>
                </IonRow>
                <IonLabel>
                  <Notification
                    text={
                      verification === 0
                        ? "* 이메일로 전송된 인증번호를 입력해주세요"
                        : verification === 1
                        ? "* 이메일 인증이 성공했습니다."
                        : verification === 2
                        ? "* 이메일 인증이 실패했습니다. 다시 시도해주세요"
                        : ""
                    }
                  />
                </IonLabel>
              </>
            )}

            <RowFiller px={15} />
            <Label text="비밀번호" />
            <IonInput
              value={pwd}
              type="password"
              placeholder="비밀번호를 입력해주세요"
              onIonChange={(e) => setPwd(e.detail.value!)}
              maxlength={50}
              clearInput
              required
            />

            <RowFiller px={15} />
            <Label text="비밀번호 확인" />
            <IonInput
              value={pwd2}
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              onIonChange={(e) => setPwd2(e.detail.value!)}
              maxlength={50}
              clearInput
              required
            />

            <IonItem>
              {pwd && pwd2 && pwd !== pwd2 && "비밀번호가 일치하지 않습니다."}
            </IonItem>
          </IonList>
          <BottomButton>
            <Button activated={verification === 1} type="submit">
              회원가입
            </Button>
          </BottomButton>
          <Notification text={errorEmailMessage} />
          <Notification text={errorMessage} />
        </form>
      </IonContent>
    </IonPage>
  );
};
export default Signin;
