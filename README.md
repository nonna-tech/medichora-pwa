# MedicHora (PWA)
App web progressivo **acessível** para lembretes de medicamentos com **ícones, cores e áudio** — pensado para **idosos e pessoas com baixo letramento**.

## Como usar
1. Abra `index.html` em um servidor simples (ex.: VSCode Live Server, XAMPP).
2. Clique **+ Cadastrar**, defina **horários**, **cor**, **ícone/foto** e **áudio**.
3. Na tela inicial, **Ouvir** toca as instruções; **Tomar agora** registra histórico.
4. O verificador roda a cada 30s. No horário, aparece **alerta com som** e **soneca (5min)**.
5. Instale na tela inicial (Chrome/Edge/Android) ou Safari (iOS).

## Offline
- `service-worker.js` com cache estático (páginas, CSS/JS, ícones e som).
- Dados ficam no `localStorage` do navegador (**sem** servidor).

## Limitações
- iOS/Safari pode não vibrar. Sons exigem ação do usuário (política do navegador).
- Alarmes exatos dependem do app estar ativo.

## LGPD
Dados ficam **apenas** no seu dispositivo. Evite dados identificáveis e diagnósticos. Prefira ícones/cores e áudios curtos.
