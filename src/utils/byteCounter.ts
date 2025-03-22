// 바이트 계산기
// 출처 https://blog.naver.com/gytks4/222275082864
/* 
  function byteCounter(text: string): number {
  return new TextEncoder().encode(text).length;
} 유니코드 기준 UTF-8 인코딩 바이트 수를 구해줌
 옵션 선택형 UI로 구현할 수도 있음. 클래스 토글 구현 방법 채팅 참조
*/
export function byteCounter(text: string, blank: number = 0) {
  let byte: number = 0;

  if (blank === 0) {
    // 공백이 미포함이면 미리 줄바꿈과 공백을 빈칸으로 처리
    text = text.replace(/\s+/g, "");
  }

  for (let i = 0; i < text.length; i++) {
    // 한글표현 정규식 : ㄱ-ㅎㅏ-ㅣ가-힣
    // 한자표현 정규식 : 一-龥
    // 일본어표현 정규식 : ぁ-ゔァ-ヴー々〆〤
    // 이 모든것을 /[]/ 안에 포함시켜서 연달아 써주면 "or" 처리됨
    // 한, 중, 일 언어라면, byte를 2 더해주고, 아니라면 1을 더해주고, 최종적으로 byte를 return
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣一-龥ぁ-ゔァ-ヴー々〆〤]/.test(text[i])) {
      byte = byte + 2;
    } else {
      byte++;
    }
  }
  return byte;
}
