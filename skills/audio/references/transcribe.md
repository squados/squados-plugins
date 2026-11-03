# Audio Transcribe

Escolha um transcritor, sintetizador ou leitor disponível conforme o pedido. Os comandos abaixo são exemplos para quem usar o auxiliar correspondente.

Transcribe audio using OpenAI, with optional speaker diarization when requested. Prefer the bundled CLI for deterministic, repeatable runs.

## Workflow
1. Collect inputs: audio file path(s), desired response format (text/json/diarized_json), optional language hint, and any known speaker references.
2. Verify `OPENAI_API_KEY` is set. Use the authorized audio connection/runtime mechanism when missing; do not ask the person to export variables or paste a key.
3. Run the bundled `transcribe_diarize.py` CLI with sensible defaults (fast text transcription).
4. Validate the output: transcription quality, speaker labels, and segment boundaries; iterate with a single targeted change if needed.
5. Save outputs under `output/transcribe/` when working in this repo.

## Decision rules
- Default to `gpt-4o-mini-transcribe` with `--response-format text` for fast transcription.
- If the user wants speaker labels or diarization, use `--model gpt-4o-transcribe-diarize --response-format diarized_json`.
- If audio is longer than ~30 seconds, keep `--chunking-strategy auto`.
- Prompting is not supported for `gpt-4o-transcribe-diarize`.

## Output conventions
- Use `output/transcribe/<job-id>/` for evaluation runs.
- Use `--out-dir` for multiple files to avoid overwriting.

## Dependencies (install if missing)
Prefer `uv` for dependency management.

```
uv pip install openai
```
If `uv` is unavailable:
```
python3 -m pip install openai
```

## Ambiente

Use o serviço de áudio já disponível ou a configuração segura de credenciais do runtime. A API OpenAI é uma opção que exige autenticação própria; se não estiver disponível, use a alternativa local adequada, como Whisper para transcrição. O agente cuida da preparação e dos comandos; não peça à pessoa para exportar variáveis ou colar chaves.

## Caminhos

Resolva o script pela pasta real desta skill: `SKILL_DIR/scripts/transcribe/transcribe_diarize.py`. Nos exemplos, TRANSCRIBE_CLI representa seu caminho absoluto.

## CLI quick start
Single file (fast text default):
```
python3 "$TRANSCRIBE_CLI" \
  path/to/audio.wav \
  --out transcript.txt
```

Diarization with known speakers (up to 4):
```
python3 "$TRANSCRIBE_CLI" \
  meeting.m4a \
  --model gpt-4o-transcribe-diarize \
  --known-speaker "Alice=refs/alice.wav" \
  --known-speaker "Bob=refs/bob.wav" \
  --response-format diarized_json \
  --out-dir output/transcribe/meeting
```

Plain text output (explicit):
```
python3 "$TRANSCRIBE_CLI" \
  interview.mp3 \
  --response-format text \
  --out interview.txt
```

## Reference map
- `transcribe/api.md`: supported formats, limits, response formats, and known-speaker notes.
