package main

import (
	"Open_IM/src/msg_transfer/logic"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	wg.Add(1)
	logic.Init()
	logic.Run()
	wg.Wait()
}
