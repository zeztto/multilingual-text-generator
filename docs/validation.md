# Validation

현재 source edition은 Node.js 26 환경에서 clean `npm ci` 후 typecheck·46개 generator tests·production build·기본 `npm audit` 0건을 확인했습니다. CI는 Node.js 24의 Linux·macOS matrix를 준비했으며 remote 실행 성공을 주장하지 않습니다.

회귀 검증은 11개 언어×4개 형식의 비어 있지 않은 결과·길이 제한·공백 규칙, 영어 사전 선택, 카피 최소 길이를 포함합니다. 기존 영어 선택의 Latin 출력과 카피 최소 길이 미준수는 RED→GREEN으로 확인했습니다. 언어별 어휘는 각 32개이며 중복 없는 목록 11개를 확인했습니다.

실제 브라우저 QA는 별도 담당자가 production build에서 수행합니다. 대상은 1440·1024·390·360px, 한국어 단어 경계, language/type buttons, 6개 slider 이름, 글자 제한, 복사, TXT 다운로드 readback입니다. unit generator 결과나 HTTP 접근을 실제 clipboard·download 성공으로 대신하지 않습니다.

첫 UI QA에서 한글 단어 분리와 이름 없는 slider 6개를 발견해 `keep-all`·안전한 wrap·output heading/button 폭을 수정하고 actual Radix Thumb에 accessible name을 전달했습니다. 수정 후 재검증 결과는 별도 evidence와 연결합니다.
