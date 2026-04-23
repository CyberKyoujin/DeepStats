package main

import (
	"context"
	"fmt"
	"sync"
	"time"
	"math/rand"
)

type Tick struct {
    Symbol    string    // инструмент - "BTCUSDT", "XAUUSD"
    LastPrice float64   // последняя цена сделки
    Bid       float64   // лучшая цена покупки (спрос)
    Ask       float64   // лучшая цена продажи (предложение)
    Volume    float64   // объём за 24ч
    Timestamp time.Time // когда пришёл тик
}

type RingBuffer[T any] interface {
	Push(v T) error
	Last(n int) []T
	All() []T
	Len() int
}

type PriceSlidingWindow[T any] interface {
	GetLastPrices([] T) []float64 
	Sma([] float64) 	float64
	Ema([] float64) 	float64
	Std([] float64) 	float64
}

type BybitRingBuffer[T any] struct {
	data	 []T
	head	 int
	Capacity int
	Asset 	 string
	Size	 int
}

type BybitSlidingWindow struct {
	LastPrices []float64
	Size	   int
	CurrSma	   float64 	
	CurrEma	   float64	
	CurStd 	   float64	
}

func NewBybitRingBuffer[T any](capacity int, asset string) *BybitRingBuffer[T] {

	return &BybitRingBuffer[T]{
		data: make([]T, capacity),
		head: 0,
		Capacity: capacity,
		Asset: asset,
	}

}

func NewBybitSLidingWindow(size int) *BybitSlidingWindow {

	return &BybitSlidingWindow{
		LastPrices: make([]float64, size),
		Size: size,
	}

}

// func (s *BybitSlidingWindow) GetLastPrices(r *BybitRingBuffer) float64 {

// }

// func (s *BybitSlidingWindow) Sma([]float64) float64 {
	
// }

func (r *BybitRingBuffer[T]) Push(v T) {
	r.data[r.head % r.Capacity] = v
	r.head++
	if r.Size < r.Capacity { r.Size++ }
}

func (r *BybitRingBuffer[T]) Last(n int) []T {
	return r.data[len(r.data)-n:]
}

func (r *BybitRingBuffer[T]) All() []T {
	if r.Size == r.Capacity { return r.data }

	return r.data[r.Size:]
}

func (r *BybitRingBuffer[T]) Len() int {
	return r.Size
}

func main() {

	

}