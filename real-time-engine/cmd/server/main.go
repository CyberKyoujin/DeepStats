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

type ExchangeConnector interface {
	Connect(ctx context.Context) error
	Subscribe() error
	Ticks() <-chan Tick
	Close() error
}

type BybitConnector struct {
	mu 			sync.Mutex
	connected	bool
}

type MockConnector struct {}

func (b *BybitConnector) Connect (ctx context.Context) error {return nil}
func (b *BybitConnector) Subscribe (symbols []string) error {return nil}
func (b *BybitConnector) Ticks () <-chan Tick {return  nil}
func (b *BybitConnector) Close () error {return nil}

func (b *MockConnector) Connect (ctx context.Context) error {return nil}
func (b *MockConnector) Subscribe () error {return nil}

func (b *MockConnector) Ticks () <-chan Tick {
	ch := make(chan Tick)

	go func () {
		for {
			ch <- Tick {
				Symbol: "BTCUSDT",
				LastPrice: 60000 + rand.Float64()*5000,
                Volume:    rand.Float64()*100,
			}
			time.Sleep(500 * time.Millisecond)
		}
	} ()

	return ch

}

func (b *MockConnector) Close () error {return nil}

func RunFeed(conn ExchangeConnector, duration time.Duration) {

	conn.Connect(context.Background())
	conn.Subscribe()

	ticks := conn.Ticks()
	timer := time.After(duration)

	for {
		select {
		case tick := <-ticks:
			fmt.Printf("%s: %.2f\n", tick.Symbol, tick.LastPrice)
		case <-timer:
			conn.Close()
			return 
		}
	}

}

func main() {

	mockConn := &MockConnector{}

	RunFeed(mockConn, 10*time.Second)

}