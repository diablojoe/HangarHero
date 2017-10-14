package utilities

import (
	"errors"
	"log/syslog"
)

func Papertrail(text string, level string) error {
	w, err := syslog.Dial("udp", "logsN.papertrailapp.com:XXXXX", syslog.LOG_EMERG|syslog.LOG_KERN, "hangarhero")
	if err != nil {
		return errors.New("failed to dial syslog")
	}
	switch level {
	case "Debug":
		w.Debug(text)
	case "Info":
		w.Info(text)
	case "Warn":
		w.Warning(text)
	case "Err":
		w.Err(text)
	case "Crit":
		w.Crit(text)
	default:
		w.Info(text)
	}
	return nil
}
