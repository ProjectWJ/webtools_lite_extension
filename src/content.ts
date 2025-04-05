// 이하 자모모자자 먼저 처리
/*
        복자음 / 복모음 처리 단계(결합 생성 혹은 해제)
      - 자음 뒤에 모음 뒤에 자음이 온다 + 뒤에 자음이 온다 + 마지막 두 자음이 connectableConsonant에 있다
        + 뒤에 자음이 오거나 마지막 글자이다
        -> 마지막 두 자음은 종성이고 복자음
      - 자음 뒤에 모음 뒤에 자음이 온다 + 뒤에 자음이 온다 + 마지막 두 자음이 connectableConsonant에 있다
        + 뒤에 모음이 온다
        -> 복자음 x, 뒤로 세었을 때 두 번째 자음은 종성, 첫 번째 자음은 초성
      - 자음 뒤에 모음 뒤에 모음이 온다 + 두 모음이 connectableVowel에 있다
        -> 두 모음은 중성이고 복모음
      */

/*
        let k1 = input[i];
        let k2 = input[i] + input[i + 1];
        ...
        let j1 = false;
        let j2 = false;
        ...

        자, 모, 자자, 자모, 모모, 자모자, 자모모, 자모자자, 자모모자, 자모모자자 판별
        let jamo: boolean[] = new Array(10).fill(false);

        자, 모, 자자부터 시작해서 자모모자자가 되면 j5 = true;
        자모자자, 자모모자면 j4 = true;
        우선순위는 j5부터 j1까지

        j5가 된다 해도 i + 5 하지 말 것. 자모모자자모가 되면 맨 뒤 자모 연결해야 함
        -> 마지막에 자가 오면 그 다음에 모가 오는지 확인해야 함
        예를 들어 자모모자자(ex 괁) -> 자모모자 + 자모(=> 관조)가 되기 때문
        이럴 때는 자모모자로 처리하고 자모는 나중에 처리해야 함
        자모모자자가 되려면 마지막 두 자음이 connectableConsonant에 있어야 하니까 그것도 확인해야 함

        -> 마지막에 모가 오고 자가 오지 않으면 종성은 ""로 처리해야 함

        -> 자자가 오면 어떤 모가 오더라도 중성, 종성은 ""로 처리. 현대 한글에서 초성 복자음은 없음

        또 마지막에 정규화 해줘야 함

        
        1타 입력할 때마다 textArea를 전체 검사하는 로직이기 때문에 비효율적
        그러나 복사 붙여넣기, 드래그 후 백스페이스, 중간에 입력 혹은 삭제 등
        다양한 입력 상황에 대응하기 위해 당장은 필요한 과정
        -> 나중에 최적화 로직 생각해보기


        ㅂㅜㅔㄹㄱㅇㅓ
        
        입력받으면
        빈 종성은 ""로 처리

        자음 + 모음 = 초성, 중성
        자음 + 모음 + 자음 = 초성, 중성, 종성
        자음 + 모음 + 자음 + 모음 = 초성, 중성, 초성2, 중성2
        ->
        ㄱㅏ      초성, 중성
        ㄱㅏㄴ    초성, 중성, 종성
        ㄱㅏㄴㅏ  초성, 중성, 초성, 중성

        모음 + 자음 + 자음 = 중성, 종성(조건부 복자음)
        모음 + 자음 + 자음 + 모음 = 중성, 종성, 초성(복자음 해제), 중성
        ->
        ㅏㄹㄱ    중성, 종성(복자음)
        ㅏㄹㅋ    중성, 종성, 초성
        ㅏㄹㄱㅓ  중성, 종성, 초성(복자음 해제), 중성

        모음 + 모음 = 중성(조건부 복모음)
        ->
        ㅗㅣ      중성
        ㅏㅏ      중성, 예외

        배열을 두 개 만들어서 하나는 초중종성 담는 거
        하나는 콤바인을 해야 하는지 그냥 단품처리인지
      */

// 초/중/종성 판단
/*
    입력값 검증
    - 모음이 처음에 온다 -> pass
    - 자음만 세 번 이상 나열된다 -> pass
    - 모음만 세 번 이상 나열된다 -> pass
    - 한글이 아니다 -> pass
    - 입력이 한 글자다 -> pass
    - 빈 문자열인 경우 -> pass

    기본 규칙
    - 자음 뒤에 모음이 온다
      -> 자음은 초성, 모음이 중성
    - 자음 뒤에 모음 뒤에 자음이 온다 + 뒤에 모음이 온다
      -> 마지막에 온 자음은 초성
    - 모음이 마지막에 온다
      -> 종성 없음

    복자음 / 복모음 처리 단계(결합 생성 혹은 해제)
    - 자음 뒤에 모음 뒤에 자음이 온다 + 뒤에 자음이 온다 + 마지막 두 자음이 connectableConsonant에 있다
      + 뒤에 자음이 오거나 마지막 글자이다
      -> 마지막 두 자음은 종성이고 복자음
    - 자음 뒤에 모음 뒤에 자음이 온다 + 뒤에 자음이 온다 + 마지막 두 자음이 connectableConsonant에 있다
      + 뒤에 모음이 온다
      -> 복자음 x, 뒤로 세었을 때 두 번째 자음은 종성, 첫 번째 자음은 초성
    - 자음 뒤에 모음 뒤에 모음이 온다 + 두 모음이 connectableVowel에 있다
      -> 두 모음은 중성이고 복모음
  */

/* 
    자, 모, 자자, 자모, 모모, 자모자, 자모모, 자모자자, 자모모자, 자모모자자
    i + 3 <= input.length // 자모모자자
    i + 2 <= input.length // 자모자자, 자모모자
    i + 1 <= input.legnth // 자모자, 자모모
    i <= input.length // 자자, 자모, 모모
  */

/*

        // 자모모자자
    if (i + 4 < input.length) {
      if (
        korFirst.includes(input[i]) &&
        korSecond.includes(input[i + 1]) &&
        korSecond.includes(input[i + 2]) &&
        korFirst.includes(input[i + 3]) &&
        korFirst.includes(input[i + 4])
      ) {
        // 마지막 두 자음이 connectableConsonant에 있으면
        // 마지막 두 모음이 connectableVowel에 있어야 함. 자모모자자 성립 불가
        if(input[i + 1] + input[i + 2] in connectableVowel){
          
        }
        if (input[i + 3] + input[i + 4] in connectableConsonant) {
          if (
            // 이게 마지막 글자거나 뒤에 자음이 오면
            i + 5 === input.length ||
            (i + 5 < input.length && korFirst.includes(input[i + 5]))
          ) {
            // 모모, 자자는 복모음 복자음이므로 합칠 것
            cho = input[i];
            jun = connectableVowel[connectableConsonant[input[i + 1] + input[i + 2]]];
            jon = connectableConsonant[input[i + 3] + input[i + 4]];
            console.log("자모모자자");
            combineReady[i] = cho + jun + jon;
            i += 5;
          }
          // 뒤에 모음이 오면 자모모자로 처리해야 함
          else if (i + 5 < input.length && korSecond.includes(input[i + 5])) {
            cho = input[i];
            jun = connectableVowel[input[i + 1] + input[i + 2]];
            jon = input[3];
            combineReady[i] = cho + jun + jon;
            i += 4;
          }
        }
      }
    }





        // 맨 처음에 모음이 오면
    if (i === 0 && korSecond.includes(input[i])) {
      combineReady[i] = input[i];
      console.log("맨 처음에 모음 등장");
      continue;
    }
    // 빈 문자열의 경우
    if (input === "") {
      combineReady[i] = input[i];
      console.log("빈 문자열");
      break;
    }
    // 입력이 한 글자인 경우
    if (input.length === 1) {
      console.log("입력이 하나");
      return input;
    }
    // 자음만 나열되면
    if (i + 2 < input.length) {
      if (
        (korFirst.includes(input[i]) &&
          korFirst.includes(input[i + 1]) &&
          korFirst.includes(input[i + 2])) ||
        // 모음만 나열되면
        (korSecond.includes(input[i]) &&
          korSecond.includes(input[i + 1]) &&
          korSecond.includes(input[i + 2]))
      ) {
        console.log("자음 셋 혹은 모음 셋");
        combineReady[i] = input[i];
      }
    }
    // 한글이 아닌 경우
    if (!(korEngField.kor as string).includes(input[i])) {
      console.log("한글이 아님");
      combineReady[i] = input[i];
      continue;
    }
    */

/*

    백업

    function chojungjong(input: string) {
  let combineReady: string[] = new Array(input.length).fill("");
  for (let i = 0; i < input.length; i++) {
    // 공백의 경우
    if (input[i] === " ") {
      combineReady[i] = " ";
      continue;
    }

    // 모음이 온 경우
    if (korSecond.includes(input[i])) {
      // 복모음이 온 경우(모모)
      if (
        i + 1 < input.length &&
        connectableConsonant[input[i] + input[i + 1]] !== undefined
      ) {
        combineReady[i] = connectableConsonant[input[i] + input[i + 1]];
        i++; // for문 뒤에 i++가 있으니 + 1만
        continue;
      }
      // 단모음인 경우(모)
      else {
        combineReady[i] = input[i];
        continue;
      }
    }

    // 자음이 온 경우(단어 조합 불가능할 때)
    if (korFirst.includes(input[i])) {
      // 처음부터 복자음이 온 경우(자자)
      if (
        i + 1 < input.length &&
        connectableConsonant[input[i] + input[i + 1]] !== undefined
      ) {
        combineReady[i] = connectableConsonant[input[i] + input[i + 1]];
        i++; // for문 뒤에 i++가 있으니 + 1만
        continue;
      }
      // 자음이 왔는데 조합할 모음이 없는 경우
      if (i + 1 < input.length && korSecond.includes(input[i + 1]) === false) {
        combineReady[i] = input[i];
        continue;
      }
      // 혹은 마지막 입력인 경우(자)
      if (input.length === 1 || i + 1 === input.length) {
        combineReady[i] = input[i];
        continue;
      }
    }

    // 키보드 자판 한글에 없는 글자가 온 경우
    if ((korEngField.kor as string).indexOf(input[i]) === -1) {
      combineReady[i] = input[i];
      continue;
    }

    // 다음 조건은 정상적인 한글 자모 조합을 위한 조건들이다.
    //
    // 1. 반드시 자음이 가장 먼저 와야 한다.
    // 2. 조합은 자모, 자모자, 자모모, 자모자자, 자모모자, 자모모자자가 있다.
    // 3. 자모를 통과했더라도 자모자, 자모모, 자모자자, 자모모자, 자모모자자 조합이 얼마든지 올 수 있다.
    //    따라서 함부로 카운트를 넘기면 안 된다.
    // 4. 자모모자자의 경우는 자모모자자모가 올 수 있으므로 그 점에 유의해야 한다.
    //    이 때는 자모모자로 처리하고 세 번째 자음 카운트로 넘어간다.
    // 5. 복모음, 복자음을 하기 위해서는 connectableVowel나 connectableConsonant에 있어야 한다.
    //    해당 조건을 만족하지 않을 때,
    //    비 복모음의 경우 자모 + 모로 처리하고 그 다음 카운트로 넘긴다.
    //    비 복자음의 경우 자모자 + 자로 처리 혹은 자모모자 + 자로 처리하고 마지막 자음 카운트로 넘긴다.
    // 6. 복모음의 경우 복자음보다 먼저 오므로 처리 우선순위가 높다.

    let jamo: boolean[] = new Array(6).fill(false);

    // 자모
    if (i + 1 < input.length) {
      // 자모를 만족하는 경우
      if (korFirst.includes(input[i]) && korSecond.includes(input[i + 1])) {
        console.log("자모 성립");
        jamo[0] = true;
      }
    }

    // 자모자
    if (i + 2 < input.length) {
      // 자모자를 만족하는 경우
      if (
        korFirst.includes(input[i]) &&
        korSecond.includes(input[i + 1]) &&
        korFirst.includes(input[i + 2]) // third는 여기서 쓰는 거 아님
      ) {
        console.log("자모자 성립");
        jamo[1] = true;
      }
    }

    // 자모모
    if (i + 2 < input.length) {
      // 자모모를 만족하는 경우
      if (
        korFirst.includes(input[i]) &&
        korSecond.includes(input[i + 1]) &&
        korSecond.includes(input[i + 2])
      ) {
        // 모모가 connectableVowel에 있어야 함
        if (connectableVowel[input[i + 1] + input[i + 2]]) {
          // ok
          console.log("자모모 성립");
          jamo[2] = true;
        }
      }
    }

    // 자모자자
    if (i + 3 < input.length) {
      // 자모자자를 만족하는 경우
      if (
        korFirst.includes(input[i]) &&
        korSecond.includes(input[i + 1]) &&
        korFirst.includes(input[i + 2]) &&
        korFirst.includes(input[i + 3])
      ) {
        // 자자가 connectableConsonant에 있어야 함
        if (connectableConsonant[input[i + 2] + input[i + 3]]) {
          // ok
          console.log("자모자자 성립");
          jamo[3] = true;
        }
      }
    }

    // 자모모자
    if (i + 3 < input.length) {
      // 자모모자를 만족하는 경우
      if (
        korFirst.includes(input[i]) &&
        korSecond.includes(input[i + 1]) &&
        korSecond.includes(input[i + 2]) &&
        korFirst.includes(input[i + 3])
      ) {
        // 모모가 connectableVowel에 있어야 함
        if (connectableVowel[input[i + 1] + input[i + 2]]) {
          // ok
          console.log("자모모자 성립");
          jamo[4] = true;
        }
      }
    }

    // 자모모자자
    if (i + 4 < input.length) {
      // 자모모자자를 만족하는 경우
      if (
        korFirst.includes(input[i]) &&
        korSecond.includes(input[i + 1]) &&
        korSecond.includes(input[i + 2]) &&
        korFirst.includes(input[i + 3]) &&
        korFirst.includes(input[i + 4])
      ) {
        // 자자, 모모가 각각 connectableConsonant, connectableVowel에 있어야 함
        if (
          connectableVowel[input[i + 1] + input[i + 2]] &&
          connectableConsonant[input[i + 3] + input[i + 4]]
        ) {
          // ok
          console.log("자모모자자 성립");
          jamo[5] = true;
        }
      }
    }

    // combineReady에 넣기
    // 자자 혹은 모모 합치기는 이 부분에서 처리
    let iPlus = 0; // 증가시켜야 할 i값
    if (jamo[0] === true) {
      // 자모
      combineReady[i] = input[i] + input[i + 1];
      iPlus = 1; // i는 1 증가
    }
    if (jamo[1] === true) {
      // 자모자
      combineReady[i] = input[i] + input[i + 1] + input[i + 2];
      iPlus = 2; // i는 2 증가
    }
    if (jamo[2] === true) {
      // 자모모
      let mm = connectableVowel[input[i + 1] + input[i + 2]]; // 모모 합치기
      combineReady[i] = input[i] + mm;
      iPlus = 2; // i는 2 증가
    }
    if (jamo[3] === true) {
      // 자모자자
      let jj = connectableConsonant[input[i + 2] + input[i + 3]]; // 자자 합치기
      combineReady[i] = input[i] + input[i + 1] + jj;
      iPlus = 3; // i는 2 증가
    }
    if (jamo[4] === true) {
      // 자모모자
      let mm = connectableVowel[input[i + 1] + input[i + 2]]; // 모모 합치기
      combineReady[i] = input[i] + mm + input[i + 3];
      iPlus = 3; // i는 3 증가
    }
    if (jamo[5] === true) {
      // 자모모자자
      let mm = connectableVowel[input[i + 1] + input[i + 2]]; // 모모 합치기
      let jj = connectableConsonant[input[i + 3] + input[i + 4]]; // 자자 합치기
      combineReady[i] = input[i] + mm + jj;
      iPlus = 4; // i는 4 증가
    }
    // i 증가
    i += iPlus;
  }
  console.log(combineReady);
  // 자모모자자에서 모모가 안 맞는지, 자자가 안 맞는지 확인하기?
}

    */
