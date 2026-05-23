---
slug: go-interview-guide
lang: zh
---

# Struct 与方法：Go 的"类"

**本文解决什么问题**：理解 Go 如何用 struct + 方法替代 class，掌握值接收者 vs 指针接收者的选择，以及用嵌入（embedding）实现组合。

**前置知识**：[04-functions](./A04-functions.md)（函数声明）；[03-pointers](./A03-pointers.md)（指针基础，可先跳过再回来看）。

---

## Struct = TypeScript 的 class（没有继承）

TypeScript 用 `class` 把数据和方法捆在一起：

```typescript
class User {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    greet(): string {
        return `Hi, I'm ${this.name}`;
    }
}

const u = new User("Alice", 25);
console.log(u.greet());
```

Go 把数据（struct）和方法分开写，但效果完全一样：

```go
package main

import "fmt"

// 数据：struct 定义字段
type User struct {
    Name string
    Age  int
}

// 方法：在 struct 外面定义，(u User) 是接收者
func (u User) Greet() string {
    return fmt.Sprintf("Hi, I'm %s", u.Name)
}

func main() {
    // 创建 struct（没有 new 关键字，直接用字面量）
    u := User{Name: "Alice", Age: 25}
    fmt.Println(u.Greet()) // Hi, I'm Alice
    fmt.Println(u.Name)    // Alice
}
```

---

## 创建 struct 的几种方式

```go
package main

import "fmt"

type Point struct {
    X, Y float64
}

func main() {
    // 方式 1：字段名 + 值（推荐，顺序无关）
    p1 := Point{X: 1.0, Y: 2.0}

    // 方式 2：按顺序赋值（不推荐，字段顺序变化会导致 bug）
    p2 := Point{1.0, 2.0}

    // 方式 3：先声明再赋值（字段是零值）
    var p3 Point
    p3.X = 3.0
    p3.Y = 4.0

    // 方式 4：new(T) 返回指针，不常用
    p4 := new(Point)
    p4.X = 5.0

    fmt.Println(p1, p2, p3, *p4)
    // {1 2} {1 2} {3 4} {5 0}
}
```

---

## Struct 标签（Field Tags）

struct 字段可以附加**标签**，用来告诉第三方库该如何处理这个字段。最常见的是 JSON 序列化：

```go
type User struct {
    Name  string `json:"name"`
    Email string `json:"email,omitempty"` // omitempty：零值时不输出
    Age   int    `json:"age"`
    pwd   string `json:"-"`              // "-"：永远不序列化
}
```

```go
package main

import (
    "encoding/json"
    "fmt"
)

type User struct {
    Name  string `json:"name"`
    Email string `json:"email,omitempty"`
    Age   int    `json:"age"`
}

func main() {
    u := User{Name: "Alice", Age: 25}  // Email 是零值 ""
    b, _ := json.Marshal(u)
    fmt.Println(string(b))
    // {"name":"Alice","age":25}   ← email 因 omitempty 被省略
}
```

多个库的标签写在同一行，空格分隔：

```go
type Book struct {
    Title  string `json:"title"  yaml:"title"  db:"title"`
    Author string `json:"author" yaml:"author" db:"author"`
}
```

Gin 的请求绑定用 `binding` 标签做校验，你会在 [02-request-response](../go-gin/02-request-response.md) 里大量看到这种写法：

```go
type CreateBookRequest struct {
    Title  string `json:"title"  binding:"required,min=1,max=200"`
    Author string `json:"author" binding:"required"`
    Year   int    `json:"year"   binding:"required,min=1000,max=2100"`
}
```

标签在运行时通过 `reflect` 包读取，你不需要了解 `reflect`——只要按各库的文档写对标签格式就行。

---

## 值接收者 vs 指针接收者

这是 Go 里最重要的选择之一。

**值接收者**：方法操作的是 struct 的**副本**，不会修改原始数据：

```go
func (u User) Greet() string {
    return "Hi, " + u.Name
    // 对 u 的任何修改都不影响调用方
}
```

**指针接收者**：方法操作的是原始数据，可以修改它：

```go
package main

import "fmt"

type Counter struct {
    value int
}

// 值接收者：修改无效
func (c Counter) IncrementWrong() {
    c.value++ // 修改的是副本，调用方看不到变化
}

// 指针接收者：修改有效
func (c *Counter) Increment() {
    c.value++ // 修改的是原始数据
}

func (c Counter) Value() int {
    return c.value
}

func main() {
    c := Counter{}

    c.IncrementWrong()
    fmt.Println(c.Value()) // 0（没变！）

    c.Increment()
    fmt.Println(c.Value()) // 1

    c.Increment()
    fmt.Println(c.Value()) // 2
}
```

**选择规则**（记住这两条）：

1. **需要修改 struct 的字段** → 指针接收者
2. **struct 很大**（复制代价高）→ 指针接收者
3. 否则 → 值接收者

同一个 struct 的所有方法最好统一用指针接收者或值接收者，混用会让接口实现变得复杂。

---

## 嵌入（Embedding）：组合替代继承

TypeScript 用继承复用代码：

```typescript
class Animal {
    name: string;
    speak(): string { return `${this.name} makes a sound`; }
}

class Dog extends Animal {
    fetch(): string { return `${this.name} fetches the ball`; }
}
```

Go 没有继承，用**嵌入**（把一个 struct 直接放进另一个）实现代码复用：

```go
package main

import "fmt"

type Animal struct {
    Name string
}

func (a Animal) Speak() string {
    return fmt.Sprintf("%s makes a sound", a.Name)
}

type Dog struct {
    Animal        // 嵌入 Animal（不是字段，是"内嵌"）
    Breed  string
}

func (d Dog) Fetch() string {
    return fmt.Sprintf("%s fetches the ball", d.Name) // 直接访问 Animal.Name
}

func main() {
    d := Dog{
        Animal: Animal{Name: "Rex"},
        Breed:  "Labrador",
    }

    fmt.Println(d.Speak())   // Rex makes a sound（提升的方法）
    fmt.Println(d.Fetch())   // Rex fetches the ball
    fmt.Println(d.Name)      // Rex（提升的字段）
    fmt.Println(d.Breed)     // Labrador
}
```

嵌入的 struct 的方法和字段会被**提升**（promoted）到外层 struct，可以直接访问。这不是继承——Dog 不"是"一个 Animal，只是"包含"了一个 Animal。

---

## 方法重写

嵌入后可以定义同名方法来"覆盖"内嵌的方法：

```go
package main

import "fmt"

type Animal struct {
    Name string
}

func (a Animal) Speak() string {
    return fmt.Sprintf("%s makes a sound", a.Name)
}

type Cat struct {
    Animal
}

// 覆盖 Speak 方法
func (c Cat) Speak() string {
    return fmt.Sprintf("%s says meow", c.Name)
}

func main() {
    c := Cat{Animal: Animal{Name: "Whiskers"}}
    fmt.Println(c.Speak())        // Whiskers says meow（Cat 的版本）
    fmt.Println(c.Animal.Speak()) // Whiskers makes a sound（Animal 的版本）
}
```

---

## 构造函数惯例：New 前缀函数

Go 没有构造函数关键字，惯例是写一个 `New` 开头的普通函数：

```go
package main

import (
    "errors"
    "fmt"
)

type Server struct {
    host string
    port int
}

// "构造函数"：验证参数，返回指针
func NewServer(host string, port int) (*Server, error) {
    if port <= 0 || port > 65535 {
        return nil, errors.New("invalid port")
    }
    return &Server{host: host, port: port}, nil
}

func (s *Server) Addr() string {
    return fmt.Sprintf("%s:%d", s.host, s.port)
}

func main() {
    srv, err := NewServer("localhost", 8080)
    if err != nil {
        fmt.Println("error:", err)
        return
    }
    fmt.Println(srv.Addr()) // localhost:8080
}
```
