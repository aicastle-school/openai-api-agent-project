# chatkit

## Render로 실행

### Config

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

## 로컬에서 실행

### Frontend (Node.js)
- Install Node.js
    ```sh
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
    ```

- Install dependencies
    ```sh
    # rm package-lock.json
    # rm -rf node_modules
    npm install
    ```

- Build
    ```sh
    npm run build
    ```

### Backend (Python)
- Install uv
    ```sh
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

- Install dependencies
    ```sh
    # rm uv.lock
    # rm -rf .venv
    uv sync
    ```

- Run server
    ```sh
    uv run main.py
    ```

## References
- OpenAI Docs
    - [chatkit](https://platform.openai.com/docs/guides/chatkit)
    - [chatkit-themes](https://platform.openai.com/docs/guides/chatkit-themes)
- ChatKit JS
    - [github](https://github.com/openai/chatkit-js)
    - [docs](https://openai.github.io/chatkit-js/)