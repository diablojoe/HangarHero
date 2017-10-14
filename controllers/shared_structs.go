package controllers

import (
	"time"
)

type errorReturn struct {
	Code    int64
	English string
}

type schedule struct {
	Id      int64     `json:"id"`
	Content string    `json:"content"`
	Start   time.Time `json:"start"`
	End     time.Time `json:"end"`
	Type    string    `json:"type"`
	Group   string    `json:"group"`
}

type instanceUpdateRequest struct {
	Id        int64
	StartTime time.Time
	EndTime   time.Time
}
