# chatkit

## Render에서 배포

### Config 설정

- Language: `Python 3`
- Branch: `multi-agent`
- Region: `Singapore`
- Build Command
    ```sh
    uv sync
    ```
- Start Command
    ```sh
    uv run main.py
    ```
- Instance Type: Free (안정적인 사용을 원하면 유료 플랜 권장)
- Environment Variables
    - `OPENAI_API_KEY`: OpenAI API Key
    - `WORKFLOW_ID`: Workflow ID (Agent Builder에서 생성된 ID)

### Domain allowlist 설정
- render에서 URL 복사 후 **OpenAI Platform**에서 도메인 허용 목록에 추가 
- [**Domain allowlist**](https://platform.openai.com/settings/organization/security/domain-allowlist) (Settings > Security > Domain allowlist)

## 코드스페이스에서 실행

```sh
npm run build && uv run main.py
```

## References
- OpenAI Docs
    - [chatkit](https://platform.openai.com/docs/guides/chatkit)
    - [chatkit-themes](https://platform.openai.com/docs/guides/chatkit-themes)
- ChatKit JS
    - [github](https://github.com/openai/chatkit-js)
    - [docs](https://openai.github.io/chatkit-js/)