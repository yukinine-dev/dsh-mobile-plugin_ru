window.__ModuleLoader__.load({
  id: "@april-jk/dsh-mobile",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    const React = require("react");
    const { useCallback, useEffect, useState } = React;
    const h = React.createElement;

    const css = `
      .dshm-root{color:var(--dsw-alias-label-primary);max-width:620px;padding:4px 0 24px;font-size:14px;line-height:1.55}
      .dshm-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:24px}
      .dshm-title{font-size:18px;font-weight:600;line-height:26px;margin:0 0 4px}
      .dshm-subtle{color:var(--dsw-alias-label-secondary);margin:0}
      .dshm-status{display:inline-flex;align-items:center;gap:7px;white-space:nowrap;padding-top:4px}
      .dshm-dot{width:8px;height:8px;border-radius:50%;background:#8a8f98}
      .dshm-dot.online{background:#20a464}.dshm-dot.wait{background:#d08b19}
      .dshm-grid{display:grid;grid-template-columns:140px minmax(0,1fr);gap:0;border-top:1px solid var(--dsw-alias-border-1)}
      .dshm-label,.dshm-value{padding:13px 0;border-bottom:1px solid var(--dsw-alias-border-1)}
      .dshm-label{color:var(--dsw-alias-label-secondary)}
      .dshm-value{overflow-wrap:anywhere}
      .dshm-actions{display:flex;align-items:center;gap:10px;margin-top:22px;flex-wrap:wrap}
      .dshm-button{height:36px;border:1px solid var(--dsw-alias-border-1);border-radius:8px;padding:0 16px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;white-space:nowrap}
      .dshm-button.primary{border-color:#137fec;background:#137fec;color:white}.dshm-button.danger{border-color:#d04444;color:#d04444}.dshm-button:disabled{opacity:.5;cursor:default}
      .dshm-button:not(:disabled):active{transform:translateY(1px)}
      .dshm-pair{display:grid;grid-template-columns:180px minmax(0,1fr);gap:24px;align-items:center;margin-top:20px;padding:20px;border:1px solid var(--dsw-alias-border-1);border-radius:8px}
      .dshm-qr{width:180px;height:180px;background:#fff}.dshm-qr svg{display:block;width:100%;height:100%}
      .dshm-code{font-size:28px;font-weight:650;letter-spacing:0;font-variant-numeric:tabular-nums;margin:4px 0 8px}
      .dshm-error{color:#d04444;margin-top:14px}.dshm-note{color:var(--dsw-alias-label-secondary);margin-top:18px}
      .dshm-log{margin-top:30px}.dshm-log-title{font-size:15px;font-weight:600;margin:0 0 10px}
      .dshm-timeline{list-style:none;margin:0;padding:0;border-top:1px solid var(--dsw-alias-border-1)}
      .dshm-entry{display:grid;grid-template-columns:minmax(130px,1fr) minmax(190px,1.4fr) auto;gap:16px;align-items:center;padding:13px 0;border-bottom:1px solid var(--dsw-alias-border-1)}
      .dshm-device{font-weight:500}.dshm-meta,.dshm-time{color:var(--dsw-alias-label-secondary);font-size:13px}.dshm-time{text-align:right;white-space:nowrap}
      .dshm-empty{color:var(--dsw-alias-label-secondary);padding:18px 0;border-top:1px solid var(--dsw-alias-border-1);border-bottom:1px solid var(--dsw-alias-border-1)}
      .dshm-update{margin-top:24px;padding-top:18px;border-top:1px solid var(--dsw-alias-border-1)}
      .dshm-update-head{display:flex;align-items:center;justify-content:space-between;gap:16px}
      .dshm-update-title{font-size:15px;font-weight:600;margin:0}.dshm-update-copy{color:var(--dsw-alias-label-secondary);margin:4px 0 0}
      .dshm-browser{margin-top:18px;padding-top:18px;border-top:1px solid var(--dsw-alias-border-1)}
      .dshm-browser-qr{width:180px;height:180px;background:#fff;margin-top:12px}.dshm-browser-qr svg{display:block;width:100%;height:100%}
      .dshm-browser-link{display:block;margin-top:10px;color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere}
      @media(max-width:620px){.dshm-head{display:block}.dshm-status{margin-top:10px}.dshm-grid{grid-template-columns:110px minmax(0,1fr)}.dshm-pair{grid-template-columns:1fr}.dshm-qr{width:min(220px,100%);height:auto;aspect-ratio:1}}
      @media(max-width:620px){.dshm-entry{grid-template-columns:1fr auto}.dshm-time{grid-column:1/-1;text-align:left}}
    `;
    if (!document.querySelector('style[data-plugin-css="dsh-mobile"]')) {
      const style = document.createElement("style");
      style.dataset.pluginCss = "dsh-mobile";
      style.textContent = css;
      document.head.appendChild(style);
    }

    const statusText = {
      connected: "Relay подключён",
      connecting: "Relay подключается",
      offline: "Relay не подключён",
    };

    function Row({ label, value }) {
      return h(React.Fragment, null,
        h("div", { className: "dshm-label" }, label),
        h("div", { className: "dshm-value" }, value),
      );
    }

    function RemoteAccessSection() {
      const [state, setState] = useState(null);
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState("");
      const [sessions, setSessions] = useState([]);
      const [logError, setLogError] = useState("");
      const [update, setUpdate] = useState(null);
      const [updateBusy, setUpdateBusy] = useState(false);
      const [browserAccess, setBrowserAccess] = useState(null);
      const [browserBusy, setBrowserBusy] = useState(false);

      const load = useCallback(async () => {
        try {
          const response = await fetch("/dsh-mobile/api/state", { cache: "no-store" });
          if (!response.ok) throw new Error(`Не удалось получить статус (${response.status})`);
          setState(await response.json());
          setError("");
        } catch (nextError) {
          setError(nextError instanceof Error ? nextError.message : String(nextError));
        }
      }, []);

      useEffect(() => {
        let active = true;
        const refresh = async () => { if (active) await load(); };
        void refresh();
        const timer = setInterval(() => void refresh(), 2000);
        return () => { active = false; clearInterval(timer); };
      }, [load]);

      const loadSessions = useCallback(async () => {
        try {
          const response = await fetch("/dsh-mobile/api/access-sessions", { cache: "no-store" });
          if (!response.ok) throw new Error(`Не удалось загрузить журнал доступа (${response.status})`);
          const body = await response.json();
          setSessions(Array.isArray(body.sessions) ? body.sessions : []);
          setLogError("");
        } catch (nextError) {
          setLogError(nextError instanceof Error ? nextError.message : String(nextError));
        }
      }, []);

      useEffect(() => {
        let active = true;
        const refresh = async () => { if (active) await loadSessions(); };
        void refresh();
        const timer = setInterval(() => void refresh(), 10000);
        return () => { active = false; clearInterval(timer); };
      }, [loadSessions]);

      const loadUpdate = useCallback(async () => {
        try {
          const response = await fetch("/dsh-mobile/api/update", { cache: "no-store" });
          if (!response.ok) throw new Error("Не удалось проверить версию");
          setUpdate(await response.json());
        } catch (nextError) {
          setUpdate({ currentVersion: "неизвестно", latestVersion: null, updateAvailable: false, checking: false, updating: false, restartRequired: false, error: nextError instanceof Error ? nextError.message : String(nextError) });
        }
      }, []);

      useEffect(() => { void loadUpdate(); }, [loadUpdate]);

      const runUpdate = async () => {
        setUpdateBusy(true);
        try {
          const response = await fetch("/dsh-mobile/api/update", { method: "POST" });
          const body = await response.json();
          if (!response.ok) throw new Error(body.message || body.reason || "Ошибка обновления");
          setUpdate(body);
        } catch (nextError) {
          setUpdate((previous) => ({ ...(previous || {}), error: nextError instanceof Error ? nextError.message : String(nextError) }));
        } finally {
          setUpdateBusy(false);
        }
      };

      const generateBrowserAccess = async () => {
        setBrowserBusy(true);
        setError("");
        try {
          const response = await fetch("/dsh-mobile/api/browser-access", { cache: "no-store" });
          const body = await response.json();
          if (!response.ok) throw new Error(body.message || body.reason || "Не удалось сгенерировать код доступа для браузера");
          setBrowserAccess(body);
        } catch (nextError) {
          setError(nextError instanceof Error ? nextError.message : String(nextError));
        } finally {
          setBrowserBusy(false);
        }
      };

      const action = async (method) => {
        setBusy(true);
        setError("");
        try {
          const response = await fetch("/dsh-mobile/api/pairing", { method });
          const body = await response.json();
          if (!response.ok) throw new Error(body.message || body.reason || `Операция не выполнена (${response.status})`);
          setState((previous) => ({ ...previous, ...body }));
          if (body.phase === "unpaired") setSessions([]);
        } catch (nextError) {
          setError(nextError instanceof Error ? nextError.message : String(nextError));
        } finally {
          setBusy(false);
        }
      };

      if (!state) {
        return h("div", { className: "dshm-root" },
          h("h2", { className: "dshm-title" }, "Удалённый доступ"),
          h("p", { className: "dshm-subtle" }, error || "Загрузка статуса Companion…"),
        );
      }

      const connected = state.relayConnection === "connected";
      const waiting = state.phase === "pairing" || state.relayConnection === "connecting";
      return h("section", { className: "dshm-root" },
        h("div", { className: "dshm-head" },
          h("div", null,
            h("h2", { className: "dshm-title" }, "Удалённый доступ"),
            h("p", { className: "dshm-subtle" }, state.phase === "paired" ? "Сопряжено" : state.phase === "pairing" ? "Ожидание подтверждения" : "Не сопряжено"),
          ),
          h("div", { className: "dshm-status" },
            h("span", { className: `dshm-dot ${connected ? "online" : waiting ? "wait" : ""}` }),
            statusText[state.relayConnection],
          ),
        ),
        h("div", { className: "dshm-grid" },
          h(Row, { label: "Имя компьютера", value: state.deviceName }),
          h(Row, { label: "DSH", value: state.dsh === "online" ? "работает" : "не отвечает" }),
          h(Row, { label: "Relay", value: state.relay }),
          h(Row, { label: "ID устройства", value: state.deviceId || "Не сопряжено" }),
        ),
        h("div", { className: "dshm-update" },
          h("div", { className: "dshm-update-head" },
            h("div", null,
              h("h3", { className: "dshm-update-title" }, "Обновление плагина"),
              h("p", { className: "dshm-update-copy" }, update?.checking ? "Проверка версии…" : update?.error ? "Не удалось проверить обновления" : update?.updateAvailable ? `Доступна новая версия ${update.latestVersion}` : `Текущая версия ${update?.currentVersion || "неизвестно"}`),
            ),
            state.localActionsAllowed && update?.updateAvailable && h("button", { className: "dshm-button primary", type: "button", disabled: updateBusy || update?.updating, onClick: () => void runUpdate() }, updateBusy || update?.updating ? "Обновление…" : "Обновить в один клик"),
          ),
          update?.restartRequired && h("p", { className: "dshm-note" }, "Обновление установлено. Перезапустите DSH, чтобы загрузить новую версию."),
          !state.localActionsAllowed && update?.updateAvailable && h("p", { className: "dshm-note" }, "Обнаружена новая версия. Откройте эту страницу настроек на компьютере, где запущен DSH, чтобы обновить."),
        ),
        state.pairing && h("div", { className: "dshm-pair" },
          h("div", { className: "dshm-qr", dangerouslySetInnerHTML: { __html: state.pairing.qrSvg } }),
          h("div", null,
            h("p", { className: "dshm-subtle" }, "Код сопряжения телефона"),
            h("div", { className: "dshm-code" }, state.pairing.code),
            h("p", { className: "dshm-subtle" }, `Действителен до ${new Date(state.pairing.expiresAt).toLocaleTimeString()}`),
          ),
        ),
        state.localActionsAllowed && h("div", { className: "dshm-actions" },
          state.phase === "unpaired" && h("button", { className: "dshm-button primary", type: "button", disabled: busy, onClick: () => void action("POST") }, busy ? "Создание…" : "Сгенерировать код сопряжения"),
          state.phase === "pairing" && h("button", { className: "dshm-button", type: "button", disabled: busy, onClick: () => void action("DELETE") }, "Отменить сопряжение"),
          state.phase === "paired" && h("button", {
            className: "dshm-button danger",
            type: "button",
            disabled: busy,
            onClick: () => {
              if (window.confirm("После удаления сопряжения телефон потеряет удалённый доступ к этому компьютеру. Для повторного использования нужно будет заново отсканировать QR-код.")) void action("DELETE");
            },
          }, busy ? "Удаление…" : "Удалить сопряжение"),
          state.phase === "paired" && h("button", { className: "dshm-button", type: "button", disabled: browserBusy, onClick: () => void generateBrowserAccess() }, browserBusy ? "Генерация…" : "Сгенерировать код доступа для браузера"),
        ),
        browserAccess && h("div", { className: "dshm-browser" },
          h("strong", null, "Код привязки браузера"),
          h("p", { className: "dshm-note" }, "Откройте эту ссылку в другом браузере или на телефоне и войдите в тот же аккаунт, чтобы добавить ещё одну точку доступа через браузер. Ключ находится во фрагменте ссылки и не отправляется на Relay."),
          h("div", { className: "dshm-browser-qr", dangerouslySetInnerHTML: { __html: browserAccess.qrSvg } }),
          h("a", { className: "dshm-browser-link", href: browserAccess.qrPayload, target: "_blank", rel: "noreferrer" }, browserAccess.qrPayload),
        ),
        !state.localActionsAllowed && h("p", { className: "dshm-note" }, "При удалённом доступе доступен только просмотр статуса. Управление сопряжением — только на этом компьютере."),
        error && h("p", { className: "dshm-error", role: "alert" }, error),
        h("div", { className: "dshm-log" },
          h("h3", { className: "dshm-log-title" }, "Хронология доступа"),
          sessions.length === 0
            ? h("div", { className: "dshm-empty" }, state.phase === "paired" ? "Пока нет записей о доступе с телефона" : "Записи появятся после завершения сопряжения")
            : h("ol", { className: "dshm-timeline" }, sessions.map((session) =>
                h("li", { className: "dshm-entry", key: session.id },
                  h("div", null,
                    h("div", { className: "dshm-device" }, session.deviceLabel),
                    h("div", { className: "dshm-meta" }, [session.platform === "ios" ? "iOS" : session.platform === "android" ? "Android" : "другое устройство", session.osVersion].filter(Boolean).join(" · ")),
                  ),
                  h("div", { className: "dshm-meta" }, `Начало ${new Date(session.startedAt).toLocaleString()} · Последний доступ ${new Date(session.lastSeenAt).toLocaleString()}`),
                  h("div", { className: "dshm-time" }, session.status === "active" ? "активно" : session.status === "expired" ? "истекло" : "завершено"),
                ),
              )),
          logError && h("p", { className: "dshm-error", role: "alert" }, logError),
        ),
      );
    }

    const inject = ["slots"];
    function apply(ctx) {
      ctx.slots.inject("settings.section", () => ctx.slots.register({
        name: "settings.section",
        id: "dsh-mobile-remote-access",
        order: 20,
        label: () => "Удалённый доступ",
        inject: () => ({}),
      }, RemoteAccessSection));
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
