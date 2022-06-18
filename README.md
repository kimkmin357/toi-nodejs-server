# toi-nodejs-server
토이 프로젝트 nodejs express server 레파지토리

1.  kakao developers 설정

    -   [kakao developers 접속](https://developers.kakao.com/)

    -   로그인 후 상단메뉴의 My Application 클릭

        ![kakao developers](https://user-images.githubusercontent.com/97032125/173851056-ef2de26e-12d9-477e-bbd1-4aa7ba8f5acc.png)

    -   Add an application 클릭하여 App name/Company name 입력

        ![Add an application](https://user-images.githubusercontent.com/97032125/173851925-d8bd21cd-c106-434f-9934-d1079352f18b.png)

    -   도메인 등록

        생성한 application 진입하여 왼편 Platform 선택 후 Register Web platform 클릭

        ![Register Web platform](https://user-images.githubusercontent.com/97032125/173852447-6cb45287-08a8-4571-b979-5f9ce099b39d.png)

        도메인 입력

        ![Enter Domain](https://user-images.githubusercontent.com/97032125/173853687-e52b049e-40c6-4494-aaa9-71343f48ee8e.png)

    -   왼편 Kakao Login 클릭하여 활성화 및 Redirect URI 입력

        ![Kakao Login 활성화](https://user-images.githubusercontent.com/97032125/173855034-21cf2794-3869-4deb-851b-9b2f7ee97785.png)

        자신이 원하는 경로를 입력하면 됨

        ![Redirect URI 입력](https://user-images.githubusercontent.com/97032125/173855619-3f8b853b-27ee-4cf8-aac3-bb694ecb8609.png)

    -   정보제공 동의 설정

        ![정보제공 동의 설정](https://user-images.githubusercontent.com/97032125/173857164-36db68d2-d4a2-4881-9751-eeef728a200d.png)

    -   시크릿 키 발급

        ![시크릿 키 발급](https://user-images.githubusercontent.com/97032125/173857584-09ee7e92-dc44-41df-9cee-260e29e84572.png)

    -   REST KEY 확인

        ![REST_KEY](https://user-images.githubusercontent.com/97032125/173860162-1a049643-439c-48d5-9078-56af719dd7a0.png)

2.  서버 구동 방법

    -   로컬에서 구동하기전 `.env` 파일을 생성하여 프로젝트에 사용되는 환경변수들을 설정

        ```bash
        IP=
        PORT=
        MONGO_URI=
        NODE_ENV=
        KAKAO_REST_KEY={kakao developers에서 발급받은 Rest Key 입력}
        KAKAO_SECRET={kakao developers에서 발급받은 Secret 입력}
        NAVER_CLIENT_ID={naver developers에서 발급받은 Client Id 입력}
        NAVER_CLIENT_SECRET={naver developers에서 발급받은 Client Secret}

        FB_APP_ID={미정}
        FB_CLIENT_SECRET={미정}
        ```

    -   npm run dev 명령 실행(사용자 환경변수에 맞춰 구동)

    -   npm run start 명령 실행(향후 배포시 사용)

3.  디렉토리 구조

    ```
    ├── config
    │   ├── configOption.js             // 실행 모드에 따른 config option 분기
    │   ├── development.js              // 개발환경에서 .env 파일로 설정한 환경변수 참조
    │   └── production.js               // 배포환경에서 사용자가 설정한 환경변수 참조
    │ 
    ├── db
    │   ├── ds.js                       // mongoose 모듈 활용 connection 함수 구현
    │   └── users.js                    // mongoose schema 생성
    │ 
    ├── node_modules
    │   └── 생략
    │ 
    ├── public                          // static으로 설정된 폴더(Client가 Server의 데이터를(html, img 등) 다이렉트로 접근 가능)
    │   ├── images                      // 각종 이미지 폴더
    │   ├── logos                       // SNS 로고 이미지 폴더
    │   └── toast.js                    // toast 동적 표시용 js 파일
    │ 
    ├── routes                          // routing 폴더
    │   ├── auth               
    │   │   ├── auth.js                 // oauth 인증 js 파일(kakao, naver)
    │   │   └── authorization.js        // 로그인 인증 js 파일(토큰 비교)
    │   ├── main.js                     // router 통합 관리 js 파일 
    │   ├── signin.js                   // signin 페이지 관련 라우팅 설정(POST,GET API)
    │   └── signup.js                   // signup 페이지 관련 라우팅 설정(POST,GET API)
    │ 
    ├── views                           // Template Engine Folder(Pug)
    │   ├── base.pug                    // 공통 포맷 설정
    │   ├── request-reset-password.pug  // 비밀번호 초기화 페이지
    │   ├── result_login.pug            // 로그인 결과 출력 페이지
    │   ├── signin.pug                  // 로그인 페이지
    │   └── signup.pug                  // 회원가입 페이지
    │ 
    ├── app.js                          // express 관련 설정 부분(라우팅, 파서, 뷰, 스태틱 설정 등)
    |── main.js                         // entry 파일(mongodb 서버 연결, app.js 호출, nodejs 서버 구동)
    ├── package-lock.json       
    ├── package.json
    ├── README.md
    ``` 

4. Reference

    -   [Node.js 기반에서 환경변수 사용하기](https://velog.io/@public_danuel/process-env-on-node-js)

    -   [dotenv로 환경변수 설정하기](https://velog.io/@iamhayoung/dotenv%EB%9E%80-Node.jsExpress%EC%97%90%EC%84%9C-dotenv%EB%A1%9C-%ED%99%98%EA%B2%BD%EB%B3%80%EC%88%98-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0)

    -   [Express에서 정적 파일 제공](https://expressjs.com/ko/starter/static-files.html)

    -   [[JS] 모듈에 대한 이해와 사용법](https://baeharam.netlify.app/posts/javascript/module)
    
    -   [nodejs ejs](https://devkingdom.tistory.com/81)

    -   [mongodb schema](https://www.zerocho.com/category/MongoDB/post/59a1870210b942001853e250)

    -   [URI랑 URL 차이점이 뭔데?](https://www.charlezz.com/?p=44767)

    -   [Mongoose(몽구스) 프로미스](https://www.zerocho.com/category/MongoDB/post/59b6228e92f5830019d41ac4)

    -   [javascript async와 await](https://joshua1988.github.io/web-development/javascript/js-async-await/)

    -   [nodejs 개념 이해하기](https://hanamon.kr/nodejs-%EA%B0%9C%EB%85%90-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0/)

    -   [[Node.js-React-MongoDB] 로그인 웹 애플리케이션 구현](https://gaga-kim.tistory.com/entry/Nodejs-React-MongoDB-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%9B%B9-%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-%EA%B5%AC%ED%98%84)

    -   [express mongodb 활용하기 - 로그인 기능 만들기 (jwt)](https://loy124.tistory.com/246)

    -   [[Node.js] json web token 기반의 Auth 구현](https://donggoolosori.github.io/2020/12/15/jwt/)

    -   [[Node.js] passport 모듈을 이용한 카카오 로그인](https://sangminlog.tistory.com/entry/kakao-login)

    -   [[NODE] 📚 카카오 로그인 (passport-kakao) ✈️ 구현](https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-%EC%B9%B4%EC%B9%B4%EC%98%A4-%EB%A1%9C%EA%B7%B8%EC%9D%B8-Passport-%EA%B5%AC%ED%98%84)

    -   [네이버-로그인-연동-개발하기(공식문서)](https://developers.naver.com/docs/login/devguide/devguide.md#3-4-%EB%84%A4%EC%9D%B4%EB%B2%84-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%97%B0%EB%8F%99-%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0)

    -   [[express] 네이버 로그인을 통해 회원 정보 받아오기](https://velog.io/@dldmswjd322/node.js-%EB%84%A4%EC%9D%B4%EB%B2%84-%EB%A1%9C%EA%B7%B8%EC%9D%B8%EC%9D%84-%ED%86%B5%ED%95%B4-%ED%9A%8C%EC%9B%90-%EC%A0%95%EB%B3%B4-%EB%B0%9B%EC%95%84%EC%98%A4%EA%B8%B0)

5. 향후 보완점

    -   비밀번호 초기화 및 이메일 인증