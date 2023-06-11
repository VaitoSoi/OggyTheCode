# Hướng dẫn sử dụng code Oggy

**Lưu ý:** Nếu bạn đã muốn chỉnh sửa code Oggy thì vui lòng lưu ý các điều sau:

1. Biết `TypeScript` (`JavaScript`):

    Làm ơn luôn, hãy học [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript) với [TypeScript](https://www.typescriptlang.org/docs/) cũng như là cách dùng [NodeJS](https://nodejs.org/en/docs) trước khi chỉnh sửa bất cứ thứ gì trong đây.

2. Biết sương sương về `Discord API` và `Discord.JS`

    Giống như trên, để thao tác một các mượt mà và để sửa lỗi dễ hơn, bạn vui lòng tìm hiểu qua về [Discord API](https://discord.com/developers/docs/intro) và [Discord.JS](https://discord.js.org/#/docs/discord.js/main/general/welcome)

3. Giữ Credit:

    Khi mới chạy code và trong các tin nhắn Embed đều xuất hiện credit, vui lòng không chỉnh hay hay xóa. Đây cũng là cách bạn thể hiện các tôn trọng với mình đấy. Cảm ơn vì đã ủng hộ Oggy nha.

## Mục lục:

I. [Set Up Environment](#i-set-up-environment)

II. [Set Up config file](#ii-set-up-config-file)

1. [Set Up bằng file env](#1-set-up-bằng-file-env)
    * [Nội dung file](#a-nội-dung-cơ-bản-của-file-env)
    * [Giải thích](#b-giải-thích)

2. [Set Up bằng file YAML](#2-set-up-bàng-file-yaml)

III. [Chạy Code](#iii-chạy-code)

IV. [Chỉnh sửa code](#iv-chỉnh-sửa-code)

1. [Chỉnh sửa command](#1-chỉnh-sửa-command)

2. [Chỉnh sửa event](#2-chỉnh-sửa-event)

3. [Các lưu ý](#3-các-lưu-ý)

## I. Set Up Environment

Những thứ Oggy cần:

|  Tên  | Phiên bản | Nơi tải |
|-------|-----------|---------|
|NodeJS | >= 16.9.0 | [Website](https://nodejs.org/en)
|Yarn   | >= 3.0.0  | [Website](https://classic.yarnpkg.com/lang/en/docs/install/)

**Lưu ý:** NodeJS là thứ bạn cần phải tải, còn Yarn thì tùy bạn :)

## II. Set Up Config file

### 1. Set Up bằng file `.env`
    
#### a. Nội dung cơ bản của file `.env`:

    DISCORD_TOKEN_1=
    DISCORD_TOKEN_2=
    DISCORD_OWNER_ID=
    DISCORD_CHANNEL_COMMANDLOG=
    DISCORD_CHANNEL_ERRORLOG=
    DISCORD_COMMAND_EXCLUDE=
    MINECRAFT_ACCOUNT_USERNAME=
    MINECRAFT_ACCOUNT_PASSWORD=
    MINECRAFT_IG_PIN=
    MINECRAFT_IG_PASS=
    MINECRAFT_SERVER_IP=
    MINECRAFT_SERVER_VERSION=
    MINECRAFT_SERVER_PORT=
    MINECRAFT_SERVER_RECONNECTTIMEOUT=
    MINECRAFT_SERVER_CHATTIMEOUT=
    MINECRAFT_SERVER_LOGINTYPE=
    STATUS_TYPE=
    STATUS_UPDATEINTERVAL=
    STATUS_DISCORD_TEXT=
    STATUS_DISCORD_TYPE=
    STATUS_MINECRAFT_CONNECT=
    STATUS_MINECRAFT_DISCONNECT=
    DATABASE_LINK=
    EXPRESS_PORT=

#### b. Giải thích:

* Nhóm `DISCORD` (liên quan đến discord):

    * `DISCORD_TOKEN_1`: Token của bot thứ nhất. Mặc định: `""`.

    * `DISCORD_TOKEN_2`: Token của bot thứ hai (optional). Mặc định: `""`.

    * `DISCORD_OWNER_ID`: ID của bạn (người sở hữu bot). Mặc định: `""`.

    * `DISCORD_CHANNEL_COMMANDLOG`: ID của kênh sẽ log mọi lệnh được gửi đi (optional). Mặc định: `""`.

    * `DISCORD_CHANNEL_ERRORLOG`: ID của kênh sẽ log mọi lệnh được gửi đi, hữu ích cho việc quan sát lỗi (optional). Mặc định: `""`.

    * `DISCORD_COMMAND_EXCLUDE`: Những lệnh sẽ không được register lên API của Discord (optional), đại khái là những lênh này người dùng không thể dùng được. Mặc định: `""`. [*](#các-lưu-ý)

* Nhóm `MINECRAFT` (liên quan đến minecraft):

    * `MINECRAFT_ACCOUNT_USERNAME`: Tên tài khoản của bot. Mặc định: `player`.

    * `MINECRAFT_ACCOUNT_PASSWORD`: Mật khẩu của tài khoản của bot (optional). Mặc định: `""`.

    * `MINECRAFT_IG_PIN`: PIN trong server của bot (khi server đăng nhập bằng cách nhập PIN). Mặc định: `1 1 1 1`.

    * `MINECRAFT_IG_PASS`: Mật khẩu trong server của bot (khi server đăng nhập bằng cách nhập mật khẩu vào thanh chat). Mặc định: `igpass`. **Lưu ý:** Tính năng này hiện chưa hoạt động.

    * `MINECRAFT_SERVER_IP`: IP của server. Mặc định: `hypixel.com`.

    * `MINECRAFT_SERVER_VERSION`: Phiên bản của server. Mặc định: `1.16.5`.

    * `MINECRAFT_SERVER_PORT`: Port của server (optional). Mặc định: `25565`.

    * `MINECRAFT_SERVER_RECONNECTTIMEOUT`: Thời gian kết nối lại server. Mặc định: `5m`. [**](#các-lưu-ý)

    * `MINECRAFT_SERVER_CHATTIMEOUT`: Thời gian chờ giữa các tin nhắn (optional). Mặc định: `30s`. [**](#các-lưu-ý)

    * `MINECRAFT_SERVER_LOGINTYPE`: Kiểu login vào server (option). Cái này chưa có công dụng gì nên cứ để đó đi :v.

* Nhóm `STATUS` (liên quan thanh trạng thái của bot):

    * `STATUS_TYPE`: Loại trạng thái sẽ hiển thị, có 2 loại tương ứng với hai nhóm phụ:
        
        * `discord`: Hiển thị các dòng trạng thái có sẵn; hoạt động dựa theo các giá trị trong nhóm `STATUS_DISCORD`.

        * `minecraft`: Hiển thị trạng thái của bot, server; hoạt động dựa theo các giá trị trong nhóm `STATUS_DISCORD`.

        Mặc định: `discord`.

    * `STATUS_UPDATEINTERVAL`: Thời gian cập nhật thanh trạng thái. Mặc định: `60s`. [**](#các-lưu-ý)

    * `STATUS_DISCORD_TEXT`: Các dòng văn bản đế hiển thị. Mặc định: `OggyTheCode,`. [*](#các-lưu-ý)

    * `STATUS_DISCORD_TYPE`: Loại trạng thái hiển thị. Mặc định: `online`. [***](#các-lưu-ý)

    * `STATUS_MINECRAFT_CONNECT`: Loại trạng thái hiển thị khi bot online trong server. Mặc định: `online`. [***](#các-lưu-ý)

    * `STATUS_MINECRAFT_DISCONNECT`: Loại trạng thái hiển thị khi bot đang mất kết nối với server. Mặc định: `dnd`. [***](#các-lưu-ý)

* Các nhóm lẻ khác:

    * `DATABASE_LINK`: Link của database. **Lưu ý**: Oggy chỉ hỗ trợ [MongoDB](https://www.mongodb.com/). Mặc định `""`.

    * `EXPRESS_PORT`: Cổng của web của bot. Chỉ dùng với ip hoặc localhost, vd: `localhost:port`. Mặc định: `8000`.
    
#### **Các lưu ý:**

* Các giá trị đều phải ghi sau dấu `=`.

* Các giá trị có chữ `(optional)` ở đây nghĩa là không cần thiết để thay đổi.

* Các giá trị không để gì thì sẽ mang giá trị mặc định.

* Các giá trị mặc định là `""` nghĩa là không có giá trị mặc định.

* `*` Viết theo định dạng: `giá_trị_1, giá_trị_2,...`; thay các `giá_trị` tùy thuộc vào thông số.

* `**` Viết theo định dạng `s, m, h, ...`; vd: `5m`: 5 phút, `60s`: 60 giây, ...; Xem kỹ hơn [tại đây](https://www.npmjs.com/package/ms).

* `***` Có 4 giá trị đại diện cho 4 trạng thái:
    
    * `online`: Trạng thái `Online` (`Trực tuyến`).

    * `dnd`: Trạng thái `Do not distrub` (`Không làm phiền`).

    * `idle`: Trạng thái `Idle` (`Chờ`).

    * `invisible` Trạng thái `Offline` (`Ngoại tuyến`).

    Xem kỹ hơn [tại đây](https://discord.com/developers/docs/topics/gateway-events#update-presence-status-types).

### 2. Set Up bàng file `YAML`:

Nội dung và giải thích xem kỹ hơn tại [file này](../config.yaml).

## III. Chạy code:

Trước tiên, bạn phải tải package với 1 trong 2 script sau:

|      |                             |
|------|-----------------------------|
| NPM  | `npm install`               |
| Yarn | `yarn` hoặc `yarn install`  |

Sau đó, bạn có thể chạy code với 1 trong 3 script dưới đây:

|      |                                      |
|------|--------------------------------------|
|NodeJs| `node --loader ts-node/esm index.ts` |
| NPM  | `npm run start`                      |
| Yarn | `yarn run start`                     |

**Lưu ý:** Nếu chạy code bằng 3 script này thì bot sẽ chạy config từ file mặc định `config.env`.

Để thay đổi file bot chạy, dùng script sau:

|      |                                    |
|------|------------------------------------|
|NodeJs| node --loader ts-node/esm index.ts \<type>=\<path> |

Trong đó:

* \<type>: Là kiểu file, có thể là `env` hoặc `yaml`.

* \<path>: Là đường dẫn đến file đó, vd: `./config.env`.

## IV. Chỉnh sửa code: 

### 1. Chỉnh sửa command:

Nếu bạn muốn tạo một command bình thường:
* Bạn hãy tạo một file tại folder `src/commands/discord`.

* Nội dung file cơ bản như sau:

```js
import { SlashCommandBuilder } from '../../index'

export default new SlashCommandBuilder()
    .setName('name')
    .setDescription('decript')
    .setRun(async function (interaction) {})
```

* Sau đó bạn đổi tên command(`name`), mô tả(`decription`), và function để chạy(`run`)

* Bạn phải dùng class `SlashCommandBuilder` của file `index` vì bot được thiết kế để chạy với class này, tuy nhiên cú pháp nó sẽ giống với [SlashCommandBuilder của Discord.Js](https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder) chỉ khác là nó có thêm `function run` để chạy mỗi khi lệnh được thực thi.

**Tuy nhiên** nếu command bạn có các [Subcommand hay Subcommand Group](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups) thì mọi chuyện sẽ phức tạp hơn một chút:

* Bạn cũng tạo file ở folder `src/commands/discord`

* Nội dung file bây giờ sẽ là:

```js
import { SlashCommandBuilder } from "discord.js";
import { SlashCommandBuilderWithData } from "../../index";

export default new SlashCommandBuilderWithData()
    .setData(new SlashCommandBuilder()
        .setName('name')
        .setDescription('desciption')
        .addSubcommand(/* ... */))
    .setRun(async function (interaction, client) {})
```

* Bạn cũng sẽ thay đổi tên và mô tả như trên và như trong [docs này của Discord.JS](https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder), nhưng hãy nhớ bạn chỉ thao tác đổi tên trong function `setData()`, còn function để chạy thì bạn để trong hàm `setRun()`

Ngoài ra, Oggy còn hỗ trợ [AutoComplete](https://discord.com/developers/docs/interactions/application-commands#autocomplete) run function. Nghĩa là mỗi khi có interaction được gửi đến dưới dạng [AutoCompleteInteraction](https://discord.js.org/#/docs/discord.js/main/class/AutocompleteInteraction) thì bot sẽ chạy function của Autocomplete đó. Cách set up:

* Các bước đầu bạn làm giống như trên.

* Sau khi hoàn thành cơ bản thì bạn thêm thêm function là `setAutocompleteRun()` và để function bạn muốn chạy bên trong.

### 2. Chỉnh sửa event:

Để tạo một file event mới:

* Trước hết, bạn tạo một file trong folder `src/events/discord` hoặc `src/events/mineflayer` tùy vào event bạn muốn listen.

* Nội dung file: 

```js
import { EventBuilder, MineflayerEvents, DiscordEvents } from '../../index'

export default new EventBuilder()
    .setName()
    .setOnce()
    .setRun(function (client) {})
```

* Ở phần `setName`, tùy vào event bạn muốn listen mà bạn có thể chọn giữa `MineflayerEvents` hoặc `DiscordEvents`.

* Ở phần `setOnce`, tùy vào bạn muốn nó được listen 1 lần thì để `true`, không thì `false`.

* Ở phần args của function trong `setRun`, sau client có thể là các args của [Discord Client](https://discord.js.org/#/docs/discord.js/main/class/Client) hoặc [Mineflayer Bot](https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md#events)

### 3. Các lưu ý:

* Hãy edit code bằng [VS Code](https://code.visualstudio.com/) vì nó hỗ trợ tốt 👍.

* Trong class `Oggy` có các giá trị sau:

    * `config`: Config của bot.

    * `client_1` và `client_2`: các [Client](https://discord.js.org/#/docs/discord.js/main/class/Client) của bot

    * `bot`: [Mineflayer bot](https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md#bot), sẽ trả lại giá trị `undefined` nếu bot chưa vào server.

    * `package`: Nội dung file `package.json` của bot.

    * `data`: Các data trong khi chạy của bot. Bao gồm:
        * `loginAt`: Thời gian lúc bot login vào server.
        * `currentCluster`: Cụm server hiện tại của bot
        * `lastMsg`: Thời gian gửi tin nhắn gần nhất của bot
        * `statusInterval`: Các hàm `setInterval` của `client_1` và `client_2`.
    
    * `command`: Một [Collection](https://discord.js.org/#/docs/collection/main/class/Collection) command của bot.

    * `commandJson`: Một mảng chứa thông tin về commands của bot để đưa lên [API của Discord](https://discord.com/developers/docs/interactions/application-commands#slash-commands)

    * `plugins`: Chưa có tính năng gì :v.

    * `express`: [Client Express](https://www.npmjs.com/package/express) của bot

### Còn câu hỏi ?

Đừng ngại gì mà hãy vào [Support Server](https://discord.com/invite/NBsnNGDeQd) này kêu cứu nhé :)