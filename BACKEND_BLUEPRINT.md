# Organic Market & Café — Đặc tả triển khai Backend

**Phiên bản:** 1.0 · **Ngày:** 09/10/2026 · **Trạng thái:** Đề xuất để chủ dự án review, chưa phải các chính sách kinh doanh đã được xác nhận.

**Stack chốt theo yêu cầu:** Node.js + Express.js. Đề xuất dùng TypeScript chạy trên Node.js, PostgreSQL và Prisma. Không sử dụng NestJS.

**Mục tiêu:** Chỉ cần mang file này sang một repository khác, lập trình viên hoặc coding agent có thể dựng, kiểm thử và bàn giao một BE độc lập. File bao gồm phạm vi, quy tắc nghiệp vụ, mô hình dữ liệu, hợp đồng API, dữ liệu mẫu, kế hoạch thực thi, tiêu chí nghiệm thu và prompt triển khai. Không cần truy cập source frontend cũ để hiểu nghiệp vụ.

**Giới hạn của tài liệu:** Đây là đặc tả, chưa phải BE đã chạy. Lệnh `npm run build` chỉ biên dịch một repository đã được triển khai; nó không tự biến Markdown thành backend. Để tạo BE từ tài liệu, dùng prompt ở mục 19 trong một coding agent, sau đó dùng các lệnh nghiệm thu ở mục 18. Kết nối thanh toán/email/hosting thật cần thông tin môi trường do chủ dự án cung cấp.

## Mục lục

1. [Kết luận từ source và phạm vi](#1-kết-luận-từ-source-và-phạm-vi)
2. [Quyết định và giả định](#2-quyết-định-và-giả-định)
3. [Kiến trúc và công nghệ](#3-kiến-trúc-và-công-nghệ)
4. [Vai trò và phân quyền](#4-vai-trò-và-phân-quyền)
5. [Đặc tả chức năng](#5-đặc-tả-chức-năng)
6. [Tiền, số lượng và báo giá](#6-tiền-số-lượng-và-báo-giá)
7. [Đơn hàng, tồn kho và thanh toán](#7-đơn-hàng-tồn-kho-và-thanh-toán)
8. [Mô hình dữ liệu](#8-mô-hình-dữ-liệu)
9. [Quy ước API](#9-quy-ước-api)
10. [Danh mục endpoint](#10-danh-mục-endpoint)
11. [Payload và luồng tích hợp mẫu](#11-payload-và-luồng-tích-hợp-mẫu)
12. [Bảo mật và dữ liệu cá nhân](#12-bảo-mật-và-dữ-liệu-cá-nhân)
13. [Tích hợp với frontend hiện tại](#13-tích-hợp-với-frontend-hiện-tại)
14. [Tác vụ nền, giám sát và phục hồi](#14-tác-vụ-nền-giám-sát-và-phục-hồi)
15. [Môi trường và triển khai](#15-môi-trường-và-triển-khai)
16. [Ma trận kiểm thử](#16-ma-trận-kiểm-thử)
17. [Trình tự triển khai](#17-trình-tự-triển-khai)
18. [Hợp đồng bàn giao và lệnh nghiệm thu](#18-hợp-đồng-bàn-giao-và-lệnh-nghiệm-thu)
19. [Prompt dùng ở repository mới](#19-prompt-dùng-ở-repository-mới)
20. [Checklist review của chủ dự án](#20-checklist-review-của-chủ-dự-án)
21. [Nguồn tham chiếu](#21-nguồn-tham-chiếu)
22. [Dữ liệu seed độc lập](#22-dữ-liệu-seed-độc-lập)

## 1. Kết luận từ source và phạm vi

### 1.1. Bối cảnh sản phẩm

Website của Organic Market & Café tại **5 Druid Avenue, Stirling SA 5152, Australia**. Có bán thực phẩm qua shop, giới thiệu café và menu, thông tin cửa hàng, form hỏi về đơn mua thường xuyên. Tiền tệ hiển thị là **AUD**, giao diện tiếng Anh. Múi giờ nghiệp vụ đề xuất **Australia/Adelaide**; không lấy múi giờ máy của lập trình viên làm múi giờ cửa hàng.

Rà soát source tại commit `78330f1` ngày 09/10/2026. Frontend dùng Next.js `16.3.8`, React `19.2.8`, TypeScript và `output: 'export'`. Không tìm thấy route BE, lời gọi `fetch`/Axios hay Server Action trong `app`, `components`, `lib` ở lần rà soát này. Đây là quan sát source, không phải kiểm chứng hệ thống bán hàng ngoài đời.

### 1.2. Bằng chứng và nghĩa vụ BE

Đường dẫn trong bảng chỉ để truy vết source gốc; chúng không phải dependency khi mang tài liệu sang repo mới.

| Bằng chứng source | Hiện trạng thực tế | BE cần đáp ứng |
|---|---|---|
| `lib/catalog.ts` | 55 sản phẩm, 5 nhóm, giá mẫu theo AUD cents | Catalog trong DB; quản trị sản phẩm, giá và trạng thái |
| `components/shop-catalog.tsx` | Lọc nhóm, popup chi tiết, tăng số lượng; phần điều khiển sort đang comment | API list/filter/sort; không coi sort UI là đã bật |
| `app/shop/[slug]/page.tsx` | Trang chi tiết, sản phẩm cùng nhóm, `generateStaticParams` | Tra cứu slug, related products; chiến lược cập nhật static page |
| `components/cart-provider.tsx` | Giỏ localStorage `organic-market-basket` | Giỏ do BE xác thực, sở hữu guest/user, không tin giá client |
| `components/checkout-form.tsx` | Name/email/phone, collect/delivery, street, note; mã ngẫu nhiên 4 chữ số; chỉ lưu sessionStorage | Báo giá, đơn thật, mã duy nhất, tồn kho, giao nhận, thanh toán |
| `components/order-confirmation.tsx` | Đọc `organic-market-order`, có thông báo đơn preview chưa gửi cửa hàng | Tra đơn từ API có kiểm tra quyền; phân biệt đặt đơn và thanh toán |
| `components/account-form.tsx` | Login/register chỉ hiển thị “not connected”; mật khẩu UI tối thiểu 8 ký tự | Auth, xác minh email, reset password, session, hồ sơ |
| `components/header.tsx`, `app/layout.tsx` | Header có nhánh `/account`, nhưng mặc định chưa authenticated; chưa có page `/account` | `/me` và API lịch sử đơn; account UI là việc tích hợp bổ sung |
| `lib/cafe-menu.ts`, `components/cafe-menu-section.tsx` | 43 món, 5 section, giá chuỗi như `5.50`; hiện chỉ hiển thị | Menu đọc và quản trị; chuẩn hóa giá cents |
| `CafeCartLine`, `addCafe` trong cart provider | Có kiểu dữ liệu café và nhánh checkout collect-only, nhưng không tìm thấy UI gọi `addCafe` | Ghi nhận tính năng tiềm năng; không khẳng định café ordering đang hoạt động |
| `app/supply/page.tsx`, `components/enquiry-form.tsx` | Form supply mở mailto; tên/business/email/message bắt buộc | Lưu enquiry, chống spam, thông báo nội bộ, xử lý trạng thái |
| `app/visit/page.tsx` | Địa chỉ, contact, giờ mở cửa; không render EnquiryForm | Public settings; endpoint general enquiry là phần bổ sung, không phải form đang hiện |
| `lib/site.ts` | Contact, giờ shop/café, social, departments tĩnh | Cấu hình nội dung và giờ mở cửa có version |
| `shopUrl`, `orderUpMenuUrl` | Có hằng URL MyFoodLink và OrderUp; CTA shop đã thấy trỏ `/shop` | Không tự suy diễn có API tích hợp, đồng bộ đơn hoặc tồn kho |

**Hai chi tiết nội dung cần xử lý trước bán thật:** menu được ghi rõ là minh họa; mô tả chung café “vegetarian” nhưng seed có món ham và smoked salmon. Không tự gán nhãn chay, allergen hay chứng nhận organic dựa trên tên/ảnh. Giữ các nhãn chưa kiểm chứng ở trạng thái chưa xác nhận.

### 1.3. Phạm vi mặc định phải hoàn thành: CORE

CORE là bộ BE đầy đủ để nối các màn hình hiện có và vận hành shop:

- Catalog, category, stock, server cart, guest checkout và customer checkout.
- Register/login/logout, email verification, reset password, hồ sơ, địa chỉ, lịch sử đơn.
- Collection và delivery theo khu vực/lịch/capacity có cấu hình.
- Checkout quote, order, thanh toán tại điểm nhận/giao nếu được bật, Stripe Checkout cho thanh toán online, hủy và hoàn tiền toàn phần.
- Café menu đọc và quản trị nội dung; CORE không nhận dòng café vào giỏ.
- Supply/general enquiries; thông báo email giao dịch và email nội bộ.
- Admin API: sản phẩm, giá, tồn kho, đơn, menu, cấu hình, enquiry, media, audit, báo cáo đơn giản.
- OpenAPI, migration, seed, Docker Compose, CI, tests, runbook và hướng dẫn kết nối FE.

**Admin API là bắt buộc; dashboard admin bằng giao diện không nằm trong yêu cầu viết BE.** Bàn giao collection HTTP và tài liệu đủ để thử mọi nghiệp vụ quản trị. Cửa hàng cần một admin UI trước khi giao vận hành cho nhân viên không kỹ thuật; có thể triển khai trong công việc FE riêng.

### 1.4. Ngoài CORE và lý do

| Nhóm | Trạng thái | Lý do |
|---|---|---|
| Đặt café nội bộ, option size/milk/add-on, kitchen queue | EXT-CAFE, thiết kế điểm mở rộng ở mục 5.8 | Có dữ liệu nền nhưng chưa có luồng UI hoàn chỉnh |
| QR bàn, số bàn, dine-in, đặt bàn | Chưa triển khai | Chỉ có nội dung giới thiệu, không có nghiệp vụ/UI xác định |
| Subscription mua định kỳ, báo giá sỉ, công nợ B2B | Chưa triển khai | Supply hiện là enquiry; không phải hợp đồng mua định kỳ |
| POS, MyFoodLink/OrderUp inventory sync | Chưa triển khai | Chưa có hợp đồng API, credentials hoặc nguồn dữ liệu chuẩn |
| Loyalty, voucher, gift card, review, wishlist | Chưa triển khai | Không có UI hoặc yêu cầu tương ứng |
| Multi-branch, multi-currency, marketplace | Chưa triển khai | Một cửa hàng, AUD |
| Cân thực tế sau đặt hàng, thay thế sản phẩm, hoàn tiền một phần | Giai đoạn sau | Thay đổi tổng tiền và vòng đời payment đáng kể |
| Kế toán, hóa đơn thuế điện tử, khai thuế | Tích hợp sau khi có yêu cầu | Receipt đơn hàng không được mặc định là hóa đơn pháp lý |

Không gọi CORE là “toàn bộ nền tảng bán lẻ mọi tính năng”. “A–Z” trong file này nghĩa là triển khai trọn bộ phạm vi CORE, có cách chạy và nghiệm thu, không để các luồng bắt buộc dở dang.

## 2. Quyết định và giả định

`CONFIRMED` = yêu cầu trực tiếp từ chủ dự án. `DEFAULT` = phương án dùng để code nếu chưa có chỉnh sửa. `LIVE-GATE` = vẫn code/test đầy đủ nhưng chưa cho bán thật khi thiếu cấu hình/xác nhận nghiệp vụ.

| ID | Quyết định | Mức | Hệ quả |
|---|---|---|---|
| D01 | Node.js + Express.js | CONFIRMED | Không đổi sang NestJS hoặc Next.js API |
| D02 | BE repo độc lập; REST `/api/v1`; TypeScript strict, ESM | DEFAULT | Phù hợp TS source FE; JS ESM có thể thay thế nếu chủ dự án yêu cầu sau |
| D03 | PostgreSQL + Prisma migrations | DEFAULT | Giao dịch và constraint là nền tảng cho đơn/tồn kho |
| D04 | Một store, AUD, locale `en-AU`, timezone `Australia/Adelaide` | DEFAULT từ source | Giờ API là UTC, lịch tính theo timezone store |
| D05 | Guest checkout được phép | DEFAULT từ checkout không yêu cầu login | Session guest và order access riêng |
| D06 | Thanh toán online bằng Stripe Checkout; manual payment là cấu hình độc lập | DEFAULT / LIVE-GATE | Không thu thẻ trong API của shop; không suy diễn cửa hàng đã có Stripe |
| D07 | Hàng `per kg` bán số kg nguyên; `quantity=1` tương ứng 1.000 g | DEFAULT / LIVE-GATE | Khớp UI tăng 1; không thu tiền chênh theo cân thực tế |
| D08 | Giá niêm yết là giá cuối gồm thuế nếu áp dụng; thuế cấu hình theo SKU/phí giao | DEFAULT / LIVE-GATE | Không áp đồng loạt một thuế suất cho mọi thực phẩm |
| D09 | Café trong CORE là menu hiển thị | DEFAULT từ UI | API từ chối café cart bằng lỗi rõ ràng |
| D10 | Giao hàng giới hạn postcode AU theo allowlist | DEFAULT / LIVE-GATE | Không coi một chuỗi street là đủ để nhận delivery |
| D11 | Có pickup/delivery slot, lead time, giới hạn capacity | DEFAULT / LIVE-GATE | FE cần thêm slot selector |
| D12 | Tồn kho online do BE quản lý; shared inventory ngoài hệ thống chưa đồng bộ | DEFAULT / LIVE-GATE | Cửa hàng phải cấp quota online hoặc cập nhật stock từ vận hành |
| D13 | Không nhập đơn preview từ sessionStorage thành đơn thật | DEFAULT | Tránh tạo đơn khách chưa chủ động gửi |
| D14 | Sản phẩm/menu seed là demo; production mặc định tắt checkout | LIVE-GATE | Admin phải duyệt giá, stock, giờ, thuế, giao hàng và payment |
| D15 | Hủy toàn đơn; không sửa line/tổng tiền sau submit | DEFAULT | Thiếu hàng thì hủy/refund và đặt đơn mới; không âm thầm thay món |

Các default ở đây là quyết định thiết kế, không phải tuyên bố rằng cửa hàng hiện đang áp dụng chính sách đó. Agent triển khai không phải dừng code vì thiếu giá live: dựng sandbox, ghi rõ release blocker và hoàn thành các phần không phụ thuộc.

## 3. Kiến trúc và công nghệ

### 3.1. So sánh phương án

| Phương án | Ưu điểm | Chi phí/rủi ro | Lựa chọn |
|---|---|---|---|
| Express modular monolith + PostgreSQL | Một codebase, transaction đơn/tồn kho rõ, dễ tách repo | Phải thiết kế module/validation/auth có kỷ luật | **Chọn** |
| Express + MongoDB | Linh hoạt dữ liệu nội dung | Quan hệ order/payment/stock và báo cáo cần thêm quy ước | Không chọn cho nghiệp vụ này |
| Nhiều Express microservices | Scale/tổ chức đội riêng từng domain | Saga, messaging, triển khai và debug phức tạp sớm | Chưa cần |

API và worker chạy hai process từ cùng codebase. PostgreSQL giữ dữ liệu nghiệp vụ, sessions, idempotency và transactional outbox. Chưa cần Redis/Kafka; nếu thêm cache sau này, DB vẫn là nguồn chuẩn.

```text
Frontend Next.js / Client khác / Admin client
                    |
             HTTPS reverse proxy
                    |
          Express REST API /api/v1
             |             |
         PostgreSQL     S3-compatible media
             |
     Worker: outbox, expiry, reconciliation, email
             |                         |
       Email provider             Stripe API
                                       |
                       signed webhook -> Express API
```

### 3.2. Stack đề xuất

- Node.js **LTS còn được hỗ trợ tại thời điểm triển khai**, Express **5.x**; pin phiên bản cụ thể trong lockfile, `engines`, Docker image. Không dùng tag `latest` trong production.
- TypeScript strict, ESM, `tsx` cho development, `tsc` build. ESM import/Prisma generation phải được kiểm chứng bằng clean build.
- PostgreSQL bản stable được host hỗ trợ; pin major. Prisma cho schema/query/migration; SQL migration thủ công cho partial index/check constraint mà ORM chưa diễn đạt đủ.
- Zod cho validation runtime và schema DTO; tạo OpenAPI 3.1 từ schema hoặc đối chiếu tự động để tránh drift.
- Argon2id, Helmet, CORS allowlist, cookie/session middleware, CSRF token, Pino structured logging.
- Vitest + Supertest; integration tests dùng PostgreSQL thật qua Docker, không dùng SQLite thay hành vi locking.
- Stripe SDK phía server; Nodemailer với SMTP adapter; Mailpit cho local; S3-compatible adapter và MinIO cho local.
- Docker Compose: `db`, `api`, `worker`, `mailpit`, `minio`, job init bucket/migration. Không bắt buộc dịch vụ cloud để chạy demo.

Express 5 có thay đổi tương thích so với Express 4; kiểm tra routing và async error handling theo tài liệu chính thức khi khởi tạo. Đây là lựa chọn triển khai, không sao chép boilerplate Express 4 chưa kiểm thử. [Express 5 migration](https://expressjs.com/en/guide/migrating-5/).

### 3.3. Cấu trúc repo mục tiêu

```text
src/
  app.ts                         # app factory, không listen khi import để test
  server.ts                      # HTTP lifecycle, graceful shutdown
  worker.ts                      # background lifecycle
  config/                        # env schema, provider wiring
  shared/                        # errors, money, clock, logger, pagination
  middleware/                    # auth, permission, CSRF, limits, requestId
  infrastructure/                # prisma, smtp, s3, stripe, outbox
  modules/
    auth/ users/ catalog/ inventory/ carts/ checkout/
    orders/ payments/ fulfilment/ cafe-menu/ enquiries/
    content/ media/ admin/ audit/ reports/
prisma/
  schema.prisma
  migrations/
  seed.ts
tests/
  unit/ integration/ e2e/ fixtures/
scripts/                         # portable Node scripts, không phụ thuộc bash
docs/                            # OpenAPI, integration, operations, decisions
Dockerfile
compose.yaml
.env.example
package.json
package-lock.json
BACKEND_BLUEPRINT.md
```

Mỗi module có router → validation → controller → service → repository theo mức cần thiết. Controller chuyển HTTP, service áp nghiệp vụ và transaction; repository không quyết định quyền. Module không import controller của module khác. Không tạo generic repository/framework nội bộ nếu không giải quyết yêu cầu cụ thể.

## 4. Vai trò và phân quyền

Quyền phải kiểm tra ở BE và ở từng resource; ẩn nút trên FE không thay cho authorization.

| Vai trò | Quyền |
|---|---|
| Public | Đọc catalog/menu/settings công khai; mở guest session; đăng ký và yêu cầu email xác thực |
| Guest session | Quản lý giỏ của session; checkout; xem/hủy đơn của session theo chính sách |
| Customer | Guest quyền tương đương + profile/address/order của mình; chỉ liên kết đơn guest qua quyền sở hữu thực sự |
| Staff | Xem và xử lý fulfilment, contact tối thiểu cần thiết; xử lý enquiry; không đổi giá/quyền/refund |
| Manager | Staff + catalog/menu/stock/media, lịch giao nhận, cancellation và refund toàn phần, reports |
| Admin | Manager + settings thanh toán/thuế, quản lý nhân sự/quyền, audit, release gate |
| Worker | Service principal nội bộ, tác vụ định trước; không có endpoint public để giả làm worker |

Ánh xạ permission tối thiểu: `orders.read`, `orders.fulfil`, `orders.cancel`, `payments.collect_manual`, `payments.refund`, `catalog.write`, `inventory.adjust`, `enquiries.manage`, `content.write`, `settings.write`, `staff.manage`, `audit.read`, `reports.read`.

- Staff có `payments.collect_manual` để ghi nhận tiền mặt/POS đã thu, nhưng không được sửa payment online hoặc ghi “paid” tùy ý. Bắt buộc reference, reason và audit.
- Manual collection chỉ được ghi ở `confirmed|preparing|ready|out_for_delivery`, với toàn bộ grandTotal và chưa có collection; không thu ở pending_acceptance/cancelled/expired. Việc xác nhận đã thu là thao tác nhân sự chịu trách nhiệm, không do browser khách gửi.
- Manager có `orders.cancel`, `payments.refund`; admin phân quyền theo role cố định, không nhận role từ request register/profile.
- Khách truy cập order/address/cart của người khác trả 404; không tiết lộ resource tồn tại.
- Không cấp customer quyền bằng email giống email đơn guest. Email chưa xác minh không chứng minh quyền sở hữu.
- Tài khoản staff/admin không được đăng ký qua public API; bootstrap bằng CLI một lần, mật khẩu từ input/secret, không hardcode.
- Nhân sự phải bật TOTP MFA trước truy cập admin API ở production; recovery codes chỉ hiển thị một lần, hash trong DB.

## 5. Đặc tả chức năng

### 5.1. F-AUTH — Tài khoản, session, hồ sơ

**Register:** `name` 1–120 ký tự, email hợp lệ tối đa 254 ký tự, password 12–128 ký tự. Trim name/email, lowercase email theo quy ước hệ thống; không trim/normalize password, không tự áp quy tắc Gmail dấu chấm/plus. FE hiện min 8 nên cần đồng bộ min 12.

Tạo user `pending_verification`, hash mật khẩu, gửi verification token; response chung 202 cho email mới/đã tồn tại, không trả user ID. Token ngẫu nhiên ít nhất 32 bytes, chỉ lưu hash, TTL 24 giờ, single-use. Resend thu hồi token cũ. Xác thực thành công chuyển `active`. CORE cho guest checkout kể cả khi không đăng ký.

**Login:** lỗi credentials dùng thông báo chung; tài khoản chưa xác minh nhận trạng thái hướng dẫn xác minh sau khi password đã đúng. Tạo session mới, rotate anonymous session để chống fixation. User disabled không đăng nhập và toàn bộ session bị revoke.

**Sessions:** opaque random token qua HttpOnly cookie; lưu hash token trong DB. Customer idle TTL 7 ngày, absolute TTL 30 ngày; staff idle 30 phút, absolute 12 giờ. Đăng xuất revoke session, logout-all revoke toàn bộ session. API không lưu access/refresh JWT trong localStorage. Anonymous session absolute 30 ngày; session là credential, cart ID không phải credential.

**Quên mật khẩu:** response 202 chung, token 30 phút, single-use. Reset password revoke mọi session và reset token. Không đăng nhập tự động bằng reset token. Đổi password khi đã login cần current password, revoke các session khác.

**MFA nhân sự:** enroll TOTP sau kiểm tra password gần nhất; secret mã hóa bằng key quản lý ngoài DB. Login nhân sự sau password chỉ cấp challenge TTL 5 phút, chưa cấp session admin. Verify TOTP/recovery code tiêu thụ challenge; rate limit riêng. Cấm replay cùng time-step thành công. Disable/reset MFA chỉ qua admin khác và audit; bootstrap recovery qua CLI có kiểm tra danh tính ngoài ứng dụng.

**Profile/address:** customer sửa name/phone; thay email chưa thuộc CORE để tránh bỏ sót verify lại. Address có recipientName, phone, line1, line2?, suburb, state, postcode, country=`AU`; tối đa 10 địa chỉ, một default. Xóa địa chỉ không sửa snapshot đơn cũ.

### 5.2. F-CAT — Catalog

- Category có stable ID, slug, name, description, sortOrder, status.
- Product có stable ID/SKU, slug duy nhất, categoryId, name, summary, mô tả plain text, media, unitLabel, sellUnit, quantity rules, giá cents, taxClassId, trạng thái và version.
- Public chỉ thấy `active`; draft/archived không lộ trong list/detail. Hết hàng vẫn hiển thị với `available=false`; không giả định giá trị stock public là cam kết giữ hàng.
- Search `q` trên name/summary, case-insensitive; filter category; sort `featured|price-low|price-high|name`; tie-break bằng ID, featured dùng sortOrder. Search là tiện ích API bổ sung, FE hiện chưa có ô search.
- Pagination `page` từ 1, `pageSize` default 24, max 100; `total` và filter phải cùng điều kiện. Không trả tất cả sản phẩm không giới hạn.
- Related: tối đa 4 active cùng category, loại trừ chính nó, deterministic order; không có thì mảng rỗng.
- CORE cố định slug sau publish để không tạo dead link trong static FE. Archive thay hard delete nếu đã được tham chiếu. Sửa giá tăng version; không cập nhật snapshot đơn cũ.
- Stock manager có inventory adjustment API; không sửa `stockOnHand` trực tiếp qua product patch.

### 5.3. F-CART — Giỏ hàng

- Mỗi guest session/customer tối đa một cart active. Guest session do server tạo, không nhận arbitrary session ID từ FE.
- Dòng CORE chỉ nhận `productId`, `quantity`; BE tra SKU, giá và unit. Không nhận `name`, `price`, `total`, `tax` client như nguồn chuẩn; request có field lạ bị 422.
- `quantity` là số đơn vị bán nguyên từ 1–99; tối đa 50 dòng/cart. PATCH dùng số lượng tuyệt đối; xóa dùng DELETE. Không dùng `qty=0` như hai nghĩa khác nhau.
- Add cùng product cộng quantity nhưng phải cùng version cart và không vượt max; trả đủ cart tính lại. Sản phẩm archive/hết hàng xuất hiện trong cart dưới dạng unavailable để khách xử lý, không âm thầm bỏ dòng.
- Cart không giữ stock. Giá/tình trạng hiển thị là snapshot tại lần đọc, phải quote khi checkout.
- Login merge cart: lock hai cart; gộp cùng product, giữ toàn bộ dòng hợp lệ; vượt giới hạn trả `mergeConflicts`, không bỏ hàng âm thầm. Guest cart chuyển merged sau thành công; retry không cộng lần hai. Dòng lỗi cần khách xác nhận sửa trước checkout.
- `version` tăng sau mọi thay đổi; bắt buộc `If-Match` khi sửa. Quote ràng buộc cart version để tab khác không checkout dữ liệu cũ.
- Import giỏ localStorage chỉ là bước migration frontend một lần; BE resolve slug và validate; không import giá/tổng client. Không tự import café lines chưa được hỗ trợ.

### 5.4. F-FUL — Giao nhận

**Collect:** địa chỉ store lấy từ cấu hình, không từ client. Phí collect 0. Slot phải thuộc lịch shop, chưa quá cutoff, chưa full. Hết capacity phải từ chối tại submit ngay cả khi UI vừa thấy còn chỗ.

**Delivery:** bắt buộc address có postcode và suburb; country AU, postcode chuỗi 4 số. Đối chiếu `state + postcode` trong zone active, không suy luận khả năng giao từ Google Maps link. Mỗi cặp chỉ thuộc tối đa một zone active. Không có zone → `DELIVERY_UNAVAILABLE`.

Zone chứa `feeMinor`, `minimumSubtotalMinor`, `freeShippingThresholdMinor?`, lead time và slot rules. Minimum và free-shipping threshold so với goods subtotal trước phí giao; không tính thuế hai lần. Address hợp lệ về format không có nghĩa là địa chỉ đã geocode; staff xử lý địa chỉ mơ hồ trước dispatch.

Lịch tuần tách shop và café; exception theo local date thay thế lịch tuần, hỗ trợ đóng cả ngày. Không tự tính public holiday từ chữ “Public holidays”; admin phải nhập ngày cụ thể. Thuật toán slot xử lý DST bằng timezone database, loại thời điểm không tồn tại, không tạo hai slot trùng UTC.

Slot có startsAt/endsAt UTC, timezone snapshot, cutoffAt, capacity, reservedCount, bookedCount. `reserved + booked <= capacity`. Đơn chờ payment giữ reserved; được xác nhận chuyển reserved → booked. Khi pickup/delivery xong, booked vẫn đếm lịch sử; hủy trước slot trả capacity. Không giảm capacity thấp hơn tổng đã giữ/đặt.

Đổi lịch/đóng slot chỉ ngăn quote/booking mới; không âm thầm xóa đơn đã giữ/đặt. Nếu ngày nghỉ mới ảnh hưởng đơn hiện có, API trả affectedOrders để manager xử lý hủy/refund có thông báo từng đơn. Collection GET/PUT hours và slot-rules dùng version của aggregate schedule trong store_settings làm ETag.

Default development: slot 30 phút, collect lead 60 phút, 10 đơn/slot, horizon 7 ngày. Delivery demo postcode `5152`, fee 1.000 cents, minimum 2.000 cents, miễn phí từ 10.000 cents, lead 24 giờ. **Toàn bộ là dữ liệu thử, không phải chính sách thật.** Production không seed zone/rate active khi chưa được duyệt.

### 5.5. F-CHK / F-ORD — Checkout và đơn hàng

- Guest/customer gửi cartId + contact + fulfilment + slotId + address (delivery) + order note + payment method để tạo quote.
- BE tính giá/thuế/phí, validate stock và lịch, trả quote TTL 10 phút. Quote không giữ stock.
- Submit chỉ nhận `quoteId`; contact và termsVersion/acceptedAt được lưu trong quote. Không cho client submit một tổng tiền thay thế.
- Khi submit, BE tái kiểm tra version, giá, stock, slot, policy và publication. Nếu thay đổi giá/quy tắc, trả 409 yêu cầu quote mới; không âm thầm tăng tiền.
- Mỗi quote chỉ sinh tối đa một order; `Idempotency-Key` bắt buộc. Mã public đề xuất `OM-YYYYMMDD-XXXXXXXX`, hậu tố random đủ entropy, unique constraint và retry khi collision. UUID là PK; mã order không phải secret.
- Snapshot bất biến gồm người nhận, địa chỉ, line, SKU/name/unit/price/quantity/tax, fees, currency, totals, policyVersion và lịch. Update catalog/profile sau này không thay đơn đã đặt.
- Sau commit order, cart chuyển `converted`; browser chỉ clear giỏ sau khi nhận order đã lưu. Payment fail vẫn có order pending, không mất khả năng retry hoặc rebuild giỏ.
- Order confirmation phải thể hiện `pending_payment`, `pending_acceptance`, `confirmed`, `cancelled`… chính xác. Redirect từ payment provider không là bằng chứng thanh toán.
- Email báo đã nhận đơn phát sau commit; lỗi gửi email không làm rollback đơn và không khiến khách phải đặt lần hai.
- Customer hủy chỉ khi `pending_payment|pending_acceptance|confirmed` và còn trước cutoffAt. Từ `preparing` trở đi chỉ manager xử lý ngoại lệ có reason. Với tiền đã thu, cancel dẫn tới refund; không tuyên bố “đã hoàn tiền” khi provider còn pending.
- CORE không sửa line, đổi địa chỉ/slot hay tự thay thế sản phẩm sau submit. Khách cần thay đổi phải hủy theo chính sách rồi tạo đơn mới.

### 5.6. F-PAY — Thanh toán

- `manual`: thu khi collect hoặc khi delivery nếu cấu hình bật. Đơn `pending_acceptance`, payment `unpaid`; sau manager/staff accept thành `confirmed`. Có hạn accept 30 phút hoặc cutoffAt, lấy thời điểm sớm hơn; hết hạn hủy và nhả reservation.
- `stripe`: một Stripe Checkout Session đang mở cho mỗi order/payment attempt; amount/currency lấy từ snapshot server. Chỉ card với kết quả tức thì trong CORE; các phương thức async bị tắt.
- Provider adapter gồm create/retrieve/expire session, verify webhook, retrieve payment, create/retrieve full refund. Dev fake adapter riêng cho tests, không có route “mark paid” công khai.
- Refund toàn phần tối đa phần tiền đã thu chưa hoàn; một refund active/order. Request cần reason và idempotency; trạng thái chỉ `succeeded` khi provider xác nhận.
- Thanh toán manual refund ghi nhận tiền hoàn ngoài hệ thống với reference/reason/audit. Không gọi Stripe cho giao dịch manual.
- Production yêu cầu HTTPS, Stripe live config, verified webhook, cấu hình phương thức theo store. Thiếu Stripe có thể vẫn vận hành manual nếu chủ dự án bật rõ ràng; không tự fallback Stripe → manual.

### 5.7. F-CMS / F-ENQ — Nội dung, menu và enquiry

**Menu:** section và menu item có thứ tự, active/hidden, image, description, `priceMinor`, `priceMode=fixed|from`, dietary labels `unverified|verified`. Giá nguồn chuỗi đổi sang cents bằng decimal parsing; không lưu chuỗi `from 5.50` làm số. CORE giá `from` chỉ để hiển thị, không được checkout.

**Nội dung:** CORE quản trị store contact/address/social/maps URL, giờ mở cửa, thông báo shop và menu. Các trang marketing dài home/about/market/supply giữ trong FE; không tự xây page builder. Public settings chỉ allowlist field được công bố; không lộ email recipients nội bộ/provider secrets.

**Enquiry:** intent `supply|general`, name/email/message bắt buộc; business bắt buộc cho supply, phone optional. Message 10–5.000 ký tự, business max 200, không nhận HTML/file attachment trong CORE. Lưu DB trước, enqueue email cho store; response 201 có reference, không tiết lộ internal notes.

Trạng thái `new → in_progress → resolved`, có thể `new|in_progress → spam`; manager có thể reopen về `in_progress` có reason. Nhân viên assignment và internal note đều audit. Đây là khách hỏi mua hàng thường xuyên, **không phải module quản lý nhà cung cấp**. Admin API không tự gửi câu trả lời ra khách; staff trả lời qua kênh email nghiệp vụ, đánh dấu xử lý bằng API.

### 5.8. EXT-CAFE — Điểm mở rộng có chủ đích

Không build extension này trong lệnh CORE mặc định. `POST /carts/:id/lines` nhận kind café phải trả `UNSUPPORTED_ITEM_KIND`; không tin `CafeCartLine.price` hay `details` từ localStorage.

Nếu được yêu cầu mở rộng sau: thêm stable menuItemId, variant và modifier group (min/max selections, required, option price cents), server pricing, line key từ item+variant+sorted options+note. Phải có menu item/order line snapshot riêng, inventory/capacity kitchen, lead time café và stock mode. Cart mixed café + shop chỉ collect, slot là giao của giờ shop/café và capacity cả hai. Kitchen note là text, không tự chuyển thành phụ phí hoặc cam kết xử lý allergy.

Extension phải bổ sung schema/API/tests và FE “add café”; không chỉ bật feature flag trên dữ liệu hiện tại. `dietary` không phải chứng nhận không nhiễm chéo; chỉ publish thông tin đã được cửa hàng xác nhận.

### 5.9. F-ADMIN / F-REPORT — Vận hành

- CRUD có archive cho catalog/menu; validate before publish; stock adjustment reason bắt buộc.
- List orders lọc status/payment/method/date, tìm public order number, phân trang; detail và timeline đầy đủ.
- Action riêng: accept, start preparing, ready, dispatch, complete, cancel; không cho generic PATCH arbitrary status.
- Báo cáo theo khoảng UTC tương ứng ngày store: count đơn, tổng tiền đã thu, tổng refund thành công, net collected, goods/shipping/tax components. `netCollected = successfulCollections - successfulRefunds`; manual chỉ tính sau mark collected. Đơn chưa thu không tính doanh thu đã thu. Refund dùng thời điểm refund, không ép về ngày order.
- CSV report tối đa 31 ngày/lần, manager/admin; escape CSV và ngăn formula injection (`=`, `+`, `-`, `@` trong text), audit export. Báo cáo vận hành không thay sổ kế toán.

## 6. Tiền, số lượng và báo giá

### 6.1. Quy tắc số

- Tất cả amount dùng integer minor unit AUD cents, field hậu tố `Minor`. Không float tiền, không parse locale string ở BE.
- CORE lượng mua `quantity` nguyên 1–99. `sellUnit=piece|pack|bunch|loaf|kg`; riêng `kg`, `baseQuantity=1000`, `baseUnit=g`, số gram giữ stock = quantity × 1000. Những unit khác stock theo count.
- Trọng lượng pack như `500 g pack` là mô tả gói; quantity 2 nghĩa 2 gói, không phải 2 g. `unitLabel` hiển thị độc lập `sellUnit`.
- Với sản phẩm per kg, mặc định min 1 kg, step 1 kg và thu đúng giá của khối lượng đặt. Muốn bước 100 g hoặc cân thực tế phải thay contract và UI có kiểm thử; không tự diễn giải qty hiện tại thành số thập phân.
- Limit kỹ thuật: mỗi amount không âm, mỗi order tối đa 100.000.000 cents (giới hạn chống overflow/abuse, không phải business minimum); kiểm tra intermediate bằng BigInt/decimal arithmetic, JSON trả safe integer. DB dùng bigint và mapper kiểm tra range.

### 6.2. Công thức CORE

```text
lineGrossMinor = unitPriceMinor * quantity
goodsSubtotalMinor = sum(lineGrossMinor)
discountMinor = 0                         # CORE không có voucher
shippingMinor = collect ? 0 : zone policy(goodsSubtotalMinor)
grandTotalMinor = goodsSubtotalMinor + shippingMinor

# Giá đã bao gồm thuế khi tax class áp dụng:
lineTaxMinor = roundHalfUp(lineGrossMinor * rateBps / (10000 + rateBps))
shippingTaxMinor = cùng công thức với tax class của shipping
taxTotalMinor = sum(lineTaxMinor) + shippingTaxMinor
netTotalMinor = grandTotalMinor - taxTotalMinor
```

`rateBps` cấu hình 0–10000; làm tròn từng line một lần rồi cộng. Thuế chỉ phân tách phần nằm trong giá, không cộng lại vào grandTotal. Đây là hợp đồng tính toán đề xuất; tax classification/rate thực tế cần người phụ trách nghiệp vụ xác nhận. Product/fee chưa được gán tax class verified không được publish cho live checkout.

Ví dụ kiểm thử với **tax demo rate 0**: oranges 690 × 2 = 1.380; milk 750 × 1 = 750; subtotal 2.130; delivery demo 1.000 → total **3.130 cents = A$31.30**. Collect cùng hàng → **A$21.30**. Không suy diễn ví dụ này là kết luận về thuế của các mặt hàng tại Australia.

### 6.3. Quote consistency

Quote lưu owner, cartVersion, canonical input hash, contact/address/note, policy/tax/price versions, lines/totals snapshot, expiresAt, consumedOrderId. Một version thay đổi liên quan đến quote khiến quote invalid tại submit. Thay description không tác động tiền có thể không invalidate; thay tax/price/eligibility phải invalidate.

Quote không giữ stock/capacity; transaction submit có thể trả `OUT_OF_STOCK`/`SLOT_FULL`. Không tự động thay slot/giảm quantity. Giá gửi vào Stripe bằng grandTotal snapshot, đối chiếu webhook bằng orderId + currency + amount + provider account/environment.

## 7. Đơn hàng, tồn kho và thanh toán

### 7.1. Ba nhóm trạng thái độc lập

**Order status:** `pending_payment`, `pending_acceptance`, `confirmed`, `preparing`, `ready`, `out_for_delivery`, `completed`, `cancelled`, `expired`.

**Payment status:** `unpaid`, `pending`, `paid`, `failed`, `refund_pending`, `refunded`.

**Inventory reservation:** `held`, `committed`, `released`. Stock ledger riêng mô tả chuyển động thực; không dùng một boolean `paid` điều khiển mọi thứ.

`paymentStatus` trên OrderView là trạng thái tổng hợp do service tính từ attempts/collections/refunds: refund succeeded toàn bộ → refunded; refund chưa kết thúc → refund_pending; đã có collection đủ tiền → paid; attempt đang mở → pending; attempt cuối failed và chưa collection → failed; còn lại unpaid. Không cho client PATCH field này. Nếu lưu projection để query report nhanh, cập nhật cùng transaction với ledger và có reconciliation.

| Từ → đến | Actor/điều kiện | Side effect nguyên tử |
|---|---|---|
| New → pending_payment | Stripe checkout submit hợp lệ | Giữ stock + slot, ghi outbox payment session request |
| New → pending_acceptance | Manual enabled | Giữ stock + slot; đặt acceptDeadline |
| pending_payment → confirmed | Provider chứng minh paid, amount đúng, hold chưa release | Reservation committed; stock trừ; slot reserved → booked |
| pending_acceptance → confirmed | Staff accept trước deadline | Commit stock/slot; payment vẫn unpaid |
| confirmed → preparing | Staff | Timeline; không trừ stock lần hai |
| preparing → ready | Staff | Notify ready; collect chờ nhận, delivery chờ dispatch |
| ready → completed | Collect, đã thu tiền | Đóng đơn; capture completion time |
| ready → out_for_delivery | Delivery, address đã được kiểm tra | Audit dispatch; manual có thể chưa thu |
| out_for_delivery → completed | Đã giao và payment paid | Đóng đơn; thất bại giao cần manager xử lý |
| pending_payment → expired | Provider session đã expire/unpaid, hết hold | Release held stock/slot một lần |
| pending_acceptance → expired | Quá deadline chưa accept | Release stock/slot, notify |
| trạng thái cho phép → cancelled | Khách hoặc manager đúng quyền và rule | Release/stock disposition; refund workflow nếu đã thu |

Không transition `cancelled|expired` trở về `confirmed`. Không checkout lại một quote đã consumed. Đơn completed không hủy trực tiếp; manager có thể full refund kèm lý do hậu mãi, order vẫn completed và payment chuyển refund state.

### 7.2. Thuật toán submit chống bán vượt tồn

Trong **một DB transaction**:

1. Claim idempotency record theo `(principalId, method, route, key)`; đối chiếu request hash.
2. Lock cart + quote; kiểm tra quyền, cartVersion, expiry và unique consumed quote.
3. Lock các stock rows theo product ID tăng dần; lock slot; đọc lại trạng thái product/price/policy cùng transaction. Các API đổi price/status/policy phải dùng cùng cơ chế lock hoặc isolation để không lọt cập nhật cạnh tranh.
4. Validate `available = onHand - reserved >= requiredBaseQuantity`; atomically tăng reserved. Check constraints cấm số âm và reserved > onHand.
5. Tăng slot reserved nếu còn capacity; nếu một row thất bại rollback toàn bộ.
6. Insert order, order lines/snapshots, reservations, payment attempt và events/outbox; set quote consumed và cart converted.
7. Lưu response/idempotency reference, commit. Trả order đã tồn tại; worker gọi provider ngoài transaction.

Không gọi Stripe/SMTP trong transaction. Khi deadlock/serialization conflict, retry toàn transaction tối đa 3 lần với jitter và idempotency. Chọn Serializable cho các transaction submit/cancel/confirm và kiểm thử; row locking có thứ tự vẫn cần để giảm xung đột. [PostgreSQL locking](https://www.postgresql.org/docs/current/explicit-locking.html), [Prisma transactions](https://www.prisma.io/docs/orm/fundamentals/transactions).

### 7.3. Commit/release và hủy

- Hold: `reserved += q`, onHand không đổi.
- Confirm: `onHand -= q`, `reserved -= q`, reservation `committed`; ledger sale với unique `(reservationId, type)`.
- Release held: `reserved -= q`, reservation `released`; không tăng onHand vì chưa trừ.
- Cancel trước preparing với stock đã commit: manager/customer cancellation service cộng lại onHand theo policy và ledger reversal unique. Từ preparing trở đi manager bắt buộc chọn `restock|waste` từng line; prepared/perishable mặc định waste. Refund không đồng nghĩa restock.
- Adjust stock giảm chỉ cho tới mức `onHand >= reserved`; phát hiện shortage thì manager xử lý các đơn liên quan, không sửa âm hoặc silently release của khách.
- Product archived không hard delete reservation/order lines; đơn paid vẫn xử lý từ snapshot.

Full refund của đơn chưa terminal phải đi qua cancellation workflow trước hoặc atomically yêu cầu cancel trong cùng command; không cho hoàn toàn bộ tiền nhưng vẫn để đơn `confirmed` tiếp tục giao. Refund hậu mãi của `completed` giữ order completed, chỉ thay payment/refund ledger. Với refund của payment thành công đến muộn trên order expired/cancelled, không tạo stock reversal lần hai.

### 7.4. Stripe, timeout và sự kiện trễ

Checkout Session đề xuất TTL 30 phút; hold nội bộ 35 phút để có khoảng đối soát. Kiểm tra giới hạn TTL của SDK/API phiên bản đang pin trước khi code. Nếu cần đổi, giữ invariant: **không nhả hold trong lúc provider session vẫn có thể thu tiền**.

- Worker tạo session với provider idempotency key ổn định từ paymentAttemptId. Nếu mất response, retry cùng key/retrieve; không tạo lần thanh toán thứ hai.
- Submit trả `paymentSessionStatus=creating`; client gọi GET order/payment-session cho đến khi URL sẵn sàng. Nếu provider lỗi, order giữ pending và trả `retryable`; không fake success.
- Chỉ một session open/order. Retry sau failed attempt phải xác minh session cũ expired hoặc không còn khả năng thu; hết deadline thì expire order và yêu cầu quote mới.
- Worker expiry lock order/attempt, yêu cầu expire session nếu còn open và retrieve trạng thái. Provider unavailable → giữ hold, đánh dấu cần reconciliation và alert; không phỏng đoán unpaid để giải phóng stock.
- Webhook dùng raw request body, verify signature trước parse nghiệp vụ; persist event có unique provider event ID trước khi ACK. ACK 2xx sau lưu bền vững; worker xử lý retry được.
- Webhook duplicate/out-of-order không ghi ledger/thu tiền/gửi email nghiệp vụ lần hai. Dùng trạng thái đã xác minh từ provider, không downgrade paid thành failed bởi event cũ.
- Hai event khác ID nhưng cùng providerPaymentId vẫn là cùng collection. Nếu phát hiện một khoản thu khác ngoài khoản phải thu của order, lưu bằng chứng anomaly, không confirm/trừ stock thêm; enqueue refund khoản dư và alert để đối soát. Không bỏ qua khoản tiền đã thu chỉ vì local attempt bị đánh dấu failed.
- Webhook thành công chỉ confirm nếu order còn pending và reservation hợp lệ. Nếu order cancelled/expired, ghi nhận tiền thực thu rồi tạo full refund và alert; không khôi phục đơn đã giải phóng stock.
- Khách hủy pending_payment: đặt cờ cancellation requested trong transaction, worker expire/retrieve provider; chỉ chốt release khi xác định không thể thu tiếp. Nếu tiền đã thu, hoàn tiền theo cancellation. API trả 202 trong lúc xử lý.
- Chỉ redirect success URL không được chuyển paid. Phải đối soát order/payment trên API. Stripe yêu cầu xử lý webhook và tính đến retries/thứ tự sự kiện. [Stripe webhooks](https://docs.stripe.com/webhooks).

### 7.5. Idempotency và outbox

Idempotency bắt buộc với checkout submit, payment session retry, cancel, refund, stock adjustment và manual collection/refund. Key tối đa 128 ký tự, random do client sinh. Cùng key + cùng payload trả cùng resource/result; cùng key + payload khác → 409 `IDEMPOTENCY_CONFLICT`. In-progress trả 409 `REQUEST_IN_PROGRESS` và Retry-After. Kết quả giữ tối thiểu 24 giờ; unique business constraint vẫn bảo vệ sau khi record được dọn.

Order và outbox cùng transaction. Worker claim bằng row lease + `FOR UPDATE SKIP LOCKED`, retry exponential backoff tối đa 8 lần, dead-letter có admin replay. Handler phải idempotent vì delivery là at-least-once. Email có notification key riêng; provider hỗ trợ idempotency thì dùng. SMTP thuần không bảo đảm exactly-once nếu process chết sau khi gửi trước khi đánh dấu sent; ghi rõ giới hạn, ưu tiên không gửi trùng trong luồng bình thường.

## 8. Mô hình dữ liệu

### 8.1. Quy ước

UUID cho khóa nội bộ; FK rõ ràng; `createdAt`, `updatedAt` là `timestamptz`; soft archive cho master data; version integer cho optimistic concurrency. Tiền bigint không âm, API serialize safe integer. `jsonb` chỉ cho snapshot, payload sự kiện và cấu hình có schema, không thay toàn bộ dữ liệu quan hệ.

Các bảng dưới đây là logical schema bắt buộc; tên SQL dùng snake_case, API camelCase. Field `?` nullable. Mọi FK ngầm tham chiếu PK cùng tên domain.

| Bảng | Field cốt lõi ngoài id/timestamps | Ràng buộc/index quan trọng |
|---|---|---|
| users | email, name, phone?, passwordHash, status, emailVerifiedAt?, role, version | unique email normalized; status index |
| guest_principals | id, createdAt, expiresAt | stable owner qua session rotation; không hard delete khi còn order |
| sessions | tokenHash, userId?, guestPrincipalId?, assurance, createdAt, lastSeenAt, absoluteExpiresAt, revokedAt?, csrfVersion | unique tokenHash; exactly one user/guest principal; index expiry/user; assurance anonymous/password/mfa/enrollment_only |
| auth_tokens | userId?, orderId?, tokenHash, purpose, expiresAt, usedAt? | unique hash; exactly one subject; purpose quyết định subject type; single-use atomic update |
| guest_claim_tokens | tokenHash, guestPrincipalId, userId, expiresAt, usedAt? | unique hash; single-use; ràng buộc user đích |
| order_access_grants | orderId, sessionId, expiresAt, revokedAt? | unique order+session; owner-scope proof, không phải public order number |
| mfa_credentials | userId, encryptedSecret, enabledAt?, lastUsedStep? | unique user; key version |
| mfa_challenges | userId, tokenHash, expiresAt, usedAt? | unique tokenHash |
| mfa_recovery_codes | userId, codeHash, usedAt? | unique user+hash |
| addresses | userId, recipientName, phone, line1, line2?, suburb, state, postcode, country, isDefault, version | ownership index; partial unique default/user |
| categories | slug, name, description?, sortOrder, status, version | unique slug |
| products | sku, slug, categoryId, name, summary, description?, unitLabel, sellUnit, baseUnit, baseQuantity, minQty, maxQty, stepQty, priceMinor, currency, taxClassId, status, sortOrder, version | unique sku/slug; category+status; price index |
| product_media | productId, mediaId, sortOrder, imageFit | unique product+media; stable order |
| tax_classes | code, name, rateBps, verifiedAt?, version, active | unique code; rate range |
| stock_items | productId, onHand, reserved, version | unique product; 0 <= reserved <= onHand |
| stock_movements | productId, orderId?, reservationId?, type, quantityDelta, reason, actorId?, reference, idempotencyId? | unique logical operation; product+createdAt |
| carts | userId?, guestPrincipalId?, status, version, expiresAt | exactly one owner; partial unique active cart/owner |
| cart_lines | cartId, productId, quantity | unique cart+product; quantity bounds |
| checkout_quotes | cartId, ownerType, ownerId, cartVersion, inputHash, snapshot, policyVersion, expiresAt, consumedOrderId? | unique consumedOrderId; owner+expiry |
| orders | number, userId?, guestPrincipalId?, quoteId, status, fulfilment, slotId, deliveryZoneId?, currency, goodsSubtotalMinor, shippingMinor, taxTotalMinor, grandTotalMinor, contactSnapshot, addressSnapshot, policySnapshot, note?, termsVersion, acceptedTermsAt, paymentMethod, version, holdExpiresAt?, acceptDeadline?, cancellationRequestedAt?, completedAt? | unique number/quoteId; user+createdAt; status+createdAt |
| order_lines | orderId, productId?, skuSnapshot, nameSnapshot, unitSnapshot, baseQuantity, quantity, unitPriceMinor, lineGrossMinor, taxRateBps, lineTaxMinor, mediaSnapshot? | order index; product FK restrict archive |
| inventory_reservations | orderId, productId, quantityBase, status, expiresAt? | unique order+product; status+expiry |
| order_events | orderId, actorType, actorId?, fromStatus?, toStatus?, eventType, reason?, metadata | append-only; order+createdAt |
| payment_attempts | orderId, provider, status, amountMinor, currency, providerSessionId?, providerPaymentId?, expiresAt?, checkoutUrl?, providerIdempotencyKey, lastCheckedAt? | unique provider identifiers; partial unique active attempt/order |
| payment_collections | orderId, attemptId?, method, amountMinor, currency, externalReference, collectedAt, actorId? | unique operation/reference scope; never overwrite |
| refunds | orderId, collectionId, amountMinor, status, providerRefundId?, reason, restockDisposition?, actorType, actorId?, reference?, version | unique providerRefundId; one active/full succeeded refund/collection; system actor cho auto-refund sự kiện trễ |
| provider_events | provider, externalEventId, payload, status, attempts, nextAttemptAt?, lastError? | unique provider+externalEventId; payload retention |
| business_hours | service=shop/cafe, weekday, opensLocal, closesLocal | unique service+weekday+opensLocal; no overlap |
| business_exceptions | service, localDate, closed, windowsJson | unique service+localDate; schema validate |
| delivery_zones | code, name, active, feeMinor, minimumSubtotalMinor, freeShippingThresholdMinor?, shippingTaxClassId, leadMinutes, version | unique code |
| delivery_zone_postcodes | zoneId, state, postcode | unique state+postcode among configured active mapping |
| slot_rules | service=collect/delivery, zoneId?, weekday, opensLocal, closesLocal, intervalMinutes, leadMinutes, capacity, version | range/non-overlap check |
| fulfilment_slots | service, zoneId?, startsAt, endsAt, cutoffAt, capacity, reservedCount, bookedCount, status, version | unique scope+startsAt; explicit null handling for collect; counters >=0 and sum<=capacity |
| cafe_sections | slug, title, note?, mediaId?, sortOrder, status, version | unique slug |
| cafe_items | sectionId, slug, name, description?, priceMinor, priceMode, mediaId?, dietaryJson, status, sortOrder, version | unique slug; section+status |
| enquiries | number, intent, name, business?, email, phone?, message, status, assignedTo?, version | unique number; status+createdAt |
| enquiry_notes | enquiryId, authorId, body | internal only, append-only |
| store_settings | key, valueJson, version, updatedBy | unique key; typed schema per key |
| media_assets | objectKey, mimeType, byteSize, checksum, width, height, alt, status, createdBy, version | unique objectKey; status index |
| idempotency_keys | principalId, method, route, key, requestHash, state, resourceId?, responseJson?, expiresAt | unique principal+method+route+key |
| outbox_events | type, aggregateId, dedupeKey, payload, status, attempts, availableAt, lockedUntil?, lastError? | unique dedupeKey; status+availableAt |
| notifications | eventKey, recipient, template, status, providerMessageId?, sentAt?, attempts | unique eventKey+recipient+template |
| audit_logs | actorId?, action, resourceType, resourceId, redactedBefore?, redactedAfter?, reason?, requestId, ipHash?, createdAt | append-only, resource/time, actor/time |
| rate_limit_buckets | scope, keyHash, windowStart, count, expiresAt | unique scope+keyHash+windowStart; atomic counter |

Slot reservation relationship nằm ở order (`slotId` + trạng thái order); một order chỉ giữ một slot. Counter update và order transition cùng transaction. Tax/phí/contact snapshots có validation schema version để đọc lại sau migration.

### 8.2. Invariant liên bảng

1. `orders.grandTotalMinor = sum(order_lines.lineGrossMinor) + shippingMinor`.
2. `taxTotalMinor = sum(lineTaxMinor) + snapshot.shippingTaxMinor`; không vượt grandTotal.
3. Tổng reservation held của một product bằng stock reserved; có reconciliation job kiểm tra sai lệch.
4. Stock sale/reversal mỗi reservation tối đa một lần cho từng loại; refund không tự tạo reversal.
5. Payment amount/currency bằng snapshot order; tổng refund succeeded không vượt collections.
6. User/guest scope lấy từ session, không từ userId client. Order guest có thể gắn user chỉ qua session sở hữu hoặc token chứng minh quyền.
7. Không cascade-delete orders/payments/audit khi xóa user. Quy trình anonymize riêng, giữ dữ liệu phải giữ theo policy đã cấu hình.
8. FK và transaction bảo vệ đúng ngay cả khi có hai API process và hai worker; mutex in-memory không đủ.

### 8.3. Migration và seed

- Migration versioned, chạy trên DB trống lẫn nâng cấp bản trước; production dùng deploy migrations, không `db push` hoặc reset.
- Seed development idempotent theo slug/SKU; không duplicate khi chạy hai lần. Seed không ghi đè dữ liệu admin đã chỉnh nếu không có `--reset-demo` rõ ràng và chỉ ở DB demo.
- Seed production chỉ tạo role/config mặc định đóng và tax class chưa verified; không seed demo order, password mặc định hoặc payment fake.
- Dữ liệu catalog/menu độc lập có ở mục 22. Media asset gốc không nằm trong Markdown; thiếu ảnh phải trả `imageUrl=null` và FE fallback, không giả URL upload thành công.

## 9. Quy ước API

### 9.1. HTTP, validation, response

- Base `/api/v1`, JSON UTF-8, camelCase. ISO 8601 UTC cho timestamp; date-only dùng `YYYY-MM-DD` với timezone được chỉ rõ.
- ID là UUID; slug regex `[a-z0-9]+(?:-[a-z0-9]+)*`, tối đa 120 ký tự. Unknown query/body keys → 422; không mass-assign entity từ request.
- JSON body limit 64 KiB; webhook 1 MiB riêng; upload riêng 5 MiB. Content-Type sai trả 415, body malformed 400, vượt size 413.
- Field optional bị bỏ qua nghĩa là giữ nguyên khi PATCH; nullable field nhận null để xóa; field không nullable không nhận null. API phân biệt empty string và missing theo schema.
- Read versioned resource trả `ETag: "<version>"`. Mutation cần `If-Match`; thiếu → 428, version stale → 412. Action tài chính vẫn cần Idempotency-Key ngoài If-Match.
- `200` đọc/cập nhật, `201` tạo, `202` đã nhận workflow async, `204` delete/logout, `401` chưa auth, `403` thiếu quyền/CSRF, `404` không tìm thấy hoặc ngoài owner scope, `409` business conflict, `422` validation, `429` rate limit, `503` dependency unavailable.
- Collection trả `{ data: [], meta: { page, pageSize, total, totalPages }, requestId }`. Resource trả `{ data: {...}, requestId }`. 204 không có body. Mọi endpoint OpenAPI có response/error schema và ví dụ.
- Public catalog/menu có thể cache tối đa 60 giây + ETag; availability cần coi là gợi ý. Cart/quote/order/auth/payment/admin và mọi response chứa PII dùng `Cache-Control: no-store`.

```json
{
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "Some items are no longer available.",
    "details": [{ "path": "lines.0.quantity", "productId": "uuid", "availableQuantity": 1 }]
  },
  "requestId": "req_opaque_id"
}
```

Error code bắt buộc: `VALIDATION_ERROR`, `INVALID_CREDENTIALS`, `EMAIL_NOT_VERIFIED`, `SESSION_EXPIRED`, `FORBIDDEN`, `NOT_FOUND`, `CSRF_INVALID`, `VERSION_REQUIRED`, `VERSION_CONFLICT`, `EMPTY_CART`, `CART_CHANGED`, `PRODUCT_UNAVAILABLE`, `OUT_OF_STOCK`, `UNSUPPORTED_ITEM_KIND`, `QUOTE_EXPIRED`, `PRICE_CHANGED`, `POLICY_CHANGED`, `SLOT_FULL`, `SLOT_EXPIRED`, `DELIVERY_UNAVAILABLE`, `MINIMUM_ORDER_NOT_MET`, `IDEMPOTENCY_CONFLICT`, `REQUEST_IN_PROGRESS`, `INVALID_TRANSITION`, `PAYMENT_REQUIRED`, `PAYMENT_PROVIDER_UNAVAILABLE`, `REFUND_NOT_ALLOWED`, `RATE_LIMITED`, `CHECKOUT_DISABLED`.

Message dùng tiếng Anh phù hợp FE hiện tại; FE có thể dịch bằng code. Không trả SQL error, stack trace, token hoặc thông tin provider nhạy cảm.

### 9.2. Cookie và browser client

Deployment ưu tiên FE và API cùng origin qua reverse proxy `/api`, hoặc hai subdomain cùng site. Cookie production `Secure`, `HttpOnly`, `SameSite=Lax`, path `/`, không đặt broad Domain. Nếu dùng prefix `__Host-` phải đáp ứng đúng Secure/path/domain. Local HTTP dùng tên cookie dev riêng.

`GET /session` khởi tạo anonymous session khi chưa có và trả CSRF token gắn với session. Mọi browser mutation cần `X-CSRF-Token` + Origin allowlist; login/register/reset cũng được bảo vệ bằng anonymous session. Khi rotate session, trả token mới. CORS credential chỉ exact origin, không `*`. Frontend gọi `credentials: 'include'`.

CSRF token có thể dẫn xuất bằng HMAC từ session ID + csrfVersion với secret riêng theo mục đích lấy từ TOKEN_HASH_SECRET; so sánh constant-time. GET session trả lại token ổn định của cùng session, không rotate token mỗi lần đọc làm hỏng tab khác. Rotate session/đổi quyền tăng csrfVersion và thay token; không cần lưu token plaintext trong DB. Cookie session opaque và CSRF token là hai credential khác nhau, không trả raw session token trong JSON.

Signed webhook là ngoại lệ CSRF/session; chỉ nhận qua chữ ký provider. Direct HTTP tools vẫn phải bootstrap session/CSRF cho endpoint dùng cookie. Không mở bypass “nếu không có Origin thì cho qua” để vô hiệu CSRF. Cross-site FE/API ở hai registrable domain khác nhau chưa là default: cần đánh giá cookie third-party, SameSite=None và deployment trước khi bật.

### 9.3. Schema dùng chung

| Schema | Field và validation |
|---|---|
| Contact | name 1–120; email hợp lệ ≤254; phone normalized E.164, mặc định country AU khi nhập local; dùng thư viện phone, không regex tự chế |
| AddressInput | recipientName 1–120, phone, line1 1–200, line2? ≤200, suburb 1–100, state enum AU states/territories, postcode 4 digits, country AU |
| CartLineInput | productId UUID, quantity integer 1–99; không có giá |
| ProductWrite | sku 1–80, slug, categoryId, name 1–200, summary 1–500, description? ≤10000, unitLabel 1–80, sellUnit enum, baseUnit count/g, baseQuantity positive integer, minQty/maxQty/stepQty, priceMinor, currency AUD, taxClassId, sortOrder integer, mediaIds ≤8 |
| QuoteInput | cartId, cartVersion, contact, fulfilment collect/delivery, slotId, address chỉ khi delivery, note? ≤1000, paymentMethod manual/stripe, termsVersion, acceptedTerms=true |
| TransitionInput | action accept/start_preparing/ready/dispatch/complete; reason? ≤1000; delivery completion có deliveredAt server |
| CancelInput | reason 1–1000; manager sau preparing thêm lineDispositions với mỗi line restock/waste |
| EnquiryInput | intent supply/general, name, email, business conditional, phone?, message 10–5000, honeypot? must empty |
| MenuItemWrite | sectionId, slug, name, description?, priceMinor, priceMode fixed/from, mediaId?, dietary labels có verification, sortOrder |
| Money | integer AUD cents trong bound mục 6; không nhận string locale hoặc số âm |

Publish riêng kiểm tra đủ các field, active category, verified tax class khi live, media policy và inventory record. Category archive bị 409 nếu còn active products; bắt buộc chuyển/archive products trước. Update unit/baseQuantity sau đã có stock hoặc order bị 409, cần SKU mới để giữ nhất quán đơn vị.

## 10. Danh mục endpoint

Tất cả đường dẫn bên dưới có prefix `/api/v1` trừ health/docs ghi rõ. Ký hiệu **I** = Idempotency-Key bắt buộc; **V** = If-Match bắt buộc; **Owner** = user hoặc guest session sở hữu resource. Response trong bảng là `data` của envelope, hoặc ghi HTTP code riêng. Không coi bảng này thay cho OpenAPI được tạo trong repo BE.

### 10.1. Session, auth và customer

| Method/path | Quyền | Input | Output/điều kiện |
|---|---|---|---|
| GET `/session` | Public | — | sessionType, csrfToken, user summary nếu có; Set-Cookie nếu mới |
| POST `/auth/register` | Anonymous/session | name,email,password | 202 accepted chung |
| POST `/auth/email-verification/request` | Session | email | 202 accepted chung |
| POST `/auth/email-verification/confirm` | Session | token | 200 verified; token single-use |
| POST `/auth/login` | Session | email,password | user+csrfToken hoặc mfaChallenge; rotate cookie khi login xong |
| POST `/auth/logout` | Session | — | 204, revoke current |
| POST `/auth/logout-all` | Customer/staff | — | 204, revoke all |
| POST `/auth/password/forgot` | Session | email | 202 accepted chung |
| POST `/auth/password/reset` | Session | token,password | 204; revoke sessions |
| POST `/auth/password/change` | Customer/staff | currentPassword,newPassword | 204; rotate current, revoke others |
| POST `/auth/mfa/enroll` | Staff/admin, recent password | password | TOTP setup secret/URI một lần; no-store |
| POST `/auth/mfa/confirm` | Staff/admin | code | enabled + recoveryCodes một lần |
| POST `/auth/mfa/verify` | Session + challenge | challengeToken,code hoặc recoveryCode | authenticated session + csrfToken |
| GET `/me` | Customer/staff | — | id,name,email,phone,role,verified,version; không password/MFA secret |
| PATCH `/me` **V** | Customer/staff | name?,phone? | profile mới; không nhận role/status/email |
| GET `/me/addresses` | Customer | — | addresses |
| POST `/me/addresses` | Customer | AddressInput,isDefault? | 201 address |
| PATCH `/me/addresses/:id` **V** | Owner | address fields/isDefault | address |
| DELETE `/me/addresses/:id` **V** | Owner | — | 204; snapshot orders giữ nguyên |
| GET `/me/orders` | Customer | page,pageSize,status? | paginated own order summaries |
| POST `/orders/access/request` | Session | orderNumber,email | 202 chung; email token nếu khớp |
| POST `/orders/access/exchange` | Session | token | orderId; tạo grant cho session hiện tại TTL 24h |
| POST `/orders/:id/claim` **I** | Customer + proof guest/grant | guestClaimToken? nếu chưa có grant | order gắn user; kiểm tra và tiêu thụ proof atomically |
| POST `/auth/staff-invite/accept` | Session + invite token | token,name,password | account activated, phải enroll MFA; chưa có quyền admin session |

Order access token 32 bytes, TTL 15 phút single-use, email link dùng fragment hoặc FE exchange flow tránh token trong access logs; referrer-policy no-referrer. Grant lưu bảng `order_access_grants(orderId,sessionId,expiresAt,revokedAt)` unique order+session. Token lưu trong auth token storage mở rộng với subject orderId và purpose `order_access`; phải kiểm tra đúng purpose. Không cho token này đổi password hoặc gọi admin. Customer login sở hữu guest session có thể claim đơn của chính session; claim bằng grant cũng được, không claim hàng loạt chỉ bằng email.

**MFA bootstrap ngoại lệ:** nhân sự đã đúng password nhưng chưa enroll chỉ được session `mfa_enrollment_only` TTL 10 phút, quyền đúng hai endpoint enroll/confirm và logout. Không cho session này truy cập admin. Sau confirm revoke enrollment session và cấp MFA-authenticated session. Enrollment endpoint đòi password của chính nhân sự; admin không đọc được secret của người khác.

TOTP period 30 giây, cho lệch tối đa một step mỗi phía, rate limit 5 attempts/challenge; recovery code single-use trong transaction. Token email/reset/claim được consume bằng conditional UPDATE `usedAt IS NULL AND expiresAt > now()`, không chỉ check rồi update rời. Dùng cùng cơ chế chống race cho invite, verification và reset.

### 10.2. Public, cart và checkout

| Method/path | Quyền | Input | Output/điều kiện |
|---|---|---|---|
| GET `/categories` | Public | — | categories active theo sortOrder |
| GET `/products` | Public | q?,category?,sort?,page?,pageSize? | paginated ProductView |
| GET `/products/:slug` | Public | slug | ProductDetail + related tối đa 4 |
| GET `/cafe/menu` | Public | — | sections/items active; prices cents, priceMode |
| GET `/store` | Public | — | contact, address, weekly hours, exceptions, checkoutEnabled, methods, termsVersion |
| GET `/fulfilment/slots` | Session | cartId,method,fromDate,toDate,state?,postcode? | slots tối đa 7 ngày và estimatedFee; chưa giữ chỗ |
| POST `/carts` | Session | — | 201 cart hoặc 200 active cart hiện có |
| GET `/carts/:id` | Owner | — | cart,lines,version,estimatedTotals,issues |
| POST `/carts/:id/lines` **V** | Owner | CartLineInput | cart mới; thêm qty vào product đã có |
| PATCH `/carts/:id/lines/:lineId` **V** | Owner | quantity | cart mới; line phải thuộc cart |
| DELETE `/carts/:id/lines/:lineId` **V** | Owner | — | cart mới, kể cả cart rỗng |
| DELETE `/carts/:id/lines` **V** | Owner | — | cart rỗng,version mới |
| POST `/carts/import` **I** | Session | lines:[{slug,quantity}],max50 | cart + rejectedLines; migration demo explicit |
| POST `/carts/merge` **I** | Customer + guest claim token | guestClaimToken | cart + mergeConflicts; token single-use |
| POST `/checkout/quotes` | Owner | QuoteInput | 201 quote snapshot,expiresAt,cartVersion |
| POST `/checkout/orders` **I** | Owner quote | quoteId | 201 order summary + paymentSessionStatus |
| GET `/orders/:id` | Owner/grant hoặc staff | — | customer view hoặc admin view có field allowlist riêng |
| POST `/orders/:id/cancel` **I V** | Owner hoặc manager | CancelInput | 200/202 order + refund/cancellation status |
| GET `/orders/:id/payment-session` | Owner | — | creating/ready/failed/expired + URL chỉ khi ready |
| POST `/orders/:id/payment-session/retry` **I V** | Owner | — | 202; kiểm tra attempt cũ và hold |
| POST `/webhooks/stripe` | Signature | raw bytes | 200 persisted; 400 signature sai; 503 DB unavailable |
| POST `/enquiries` **I** | Session | EnquiryInput | 201 reference,status=new |

Login response có thể trả guestClaimToken TTL 5 phút cho cart của session trước rotation, không đưa raw session cũ vào body. Nếu auto-merge thành công không cần token. Chỉ một trong auto-merge hoặc explicit merge được hoàn thành; `mergedIntoCartId`/consumed token chống cộng hai lần. Nếu conflict, auth vẫn thành công, UI xử lý conflict riêng.

Grant/claim storage bổ sung: `guest_claim_tokens(tokenHash,guestPrincipalId,userId,expiresAt,usedAt)`; role/query không thể thay userId trong token record. GuestPrincipalId có ID bền trong DB kể cả session rotate; session cũ revoke ngay.

### 10.3. Admin catalog, inventory, menu, media

| Method/path | Permission | Input | Output/điều kiện |
|---|---|---|---|
| GET `/admin/products` | catalog.write | status?,q?,pagination | bao gồm draft/archived |
| POST `/admin/products` | catalog.write | ProductWrite | 201 draft + stock row zero |
| GET `/admin/products/:id` | catalog.write | — | full editable view/version |
| PATCH `/admin/products/:id` **V** | catalog.write | allowed ProductWrite fields | product updated; giá tăng pricing version |
| POST `/admin/products/:id/publish` **V** | catalog.write | — | active nếu đủ điều kiện |
| POST `/admin/products/:id/archive` **V** | catalog.write | reason | archived; không xóa lịch sử |
| GET/POST `/admin/categories` | catalog.write | query hoặc category fields | list / 201 draft |
| PATCH `/admin/categories/:id` **V** | catalog.write | name,description,sortOrder,status | category; archive rule mục 9 |
| GET `/admin/inventory` | inventory.adjust | productId?,pagination | onHand,reserved,available,version |
| POST `/admin/inventory/:productId/adjustments` **I V** | inventory.adjust | deltaBase integer,reason,reference | movement+stock mới; không vượt reserved |
| GET `/admin/inventory/:productId/movements` | inventory.adjust | pagination | append-only ledger |
| GET/POST `/admin/cafe/sections` | content.write | query hoặc section fields | list / 201 section |
| PATCH `/admin/cafe/sections/:id` **V** | content.write | title,note,mediaId,sortOrder,status | section; hide parent ẩn items public |
| GET/POST `/admin/cafe/items` | content.write | query hoặc MenuItemWrite | list / 201 draft item |
| GET `/admin/cafe/items/:id` | content.write | — | editable item/version |
| PATCH `/admin/cafe/items/:id` **V** | content.write | MenuItemWrite partial,status | item; validate publish |
| POST `/admin/media` | catalog.write hoặc content.write | multipart file + alt | 201 asset ready sau kiểm tra |
| GET `/admin/media` | catalog.write hoặc content.write | pagination | metadata,usageCount |
| DELETE `/admin/media/:id` **V** | catalog.write hoặc content.write | — | 204 nếu chưa dùng; đang referenced trả 409 |

File upload CORE đi qua API tới object storage, không cần presigned flow chưa dùng. Chấp nhận JPEG/PNG/WebP, xác minh magic bytes, decode/re-encode bằng library ảnh, giới hạn 25 megapixel, max 5 MiB và strip metadata. Từ chối SVG/HTML/executable. Tên object UUID, không dùng filename client làm path. Store upload pending → ready chỉ sau thành công; orphan cleanup có grace period 24 giờ. Cho phép public read ảnh sản phẩm qua CDN; không có upload PII/document trong CORE.

### 10.4. Admin operations và cấu hình

| Method/path | Permission | Input | Output/điều kiện |
|---|---|---|---|
| GET `/admin/orders` | orders.read | status,paymentStatus,method,from,to,q,pagination | paginated orders |
| GET `/admin/orders/:id` | orders.read | — | detail + lines + events + payment,redacted provider data |
| POST `/admin/orders/:id/transitions` **I V** | orders.fulfil | TransitionInput | order; state machine mục 7 |
| POST `/admin/orders/:id/cancel` **I V** | orders.cancel | CancelInput | order; cùng service customer cancel |
| POST `/admin/orders/:id/manual-collection` **I V** | payments.collect_manual | amountMinor,reference,reason | collection; đúng full amount, không duplicate |
| POST `/admin/orders/:id/refunds` **I V** | payments.refund | reason,manualReference? | 202 provider refund hoặc 201 manual refund recorded |
| GET `/admin/refunds/:id` | payments.refund | — | refund status/history |
| GET `/admin/enquiries` | enquiries.manage | intent,status,assignedTo,pagination | paginated enquiries |
| GET `/admin/enquiries/:id` | enquiries.manage | — | enquiry + internal notes |
| PATCH `/admin/enquiries/:id` **V** | enquiries.manage | status?,assignedTo?,reason? | enquiry |
| POST `/admin/enquiries/:id/notes` | enquiries.manage | body 1–5000 | 201 internal note |
| GET/PATCH `/admin/store` **V khi PATCH** | settings.write | allowed settings | public/private config, secrets không trả qua API |
| GET/PUT `/admin/hours` **V khi PUT** | settings.write | weekly schedule + date exceptions | schedule; check overlapping windows |
| GET/POST `/admin/delivery-zones` | settings.write | query hoặc zone schema | list / 201 inactive zone |
| PATCH `/admin/delivery-zones/:id` **V** | settings.write | fees,postcode allowlist,taxClass,leadMinutes,active | zone; ảnh hưởng quote version |
| GET/PUT `/admin/slot-rules` **V khi PUT** | settings.write | typed rules | rules; không hủy slot có đơn |
| GET `/admin/slots` | orders.read | range≤31 days,method,zone | capacity/counters/status |
| PATCH `/admin/slots/:id` **V** | settings.write | capacity,status | slot; không capacity dưới booked+reserved |
| GET/POST `/admin/tax-classes` | settings.write | query hoặc code,name,rateBps | list / 201 class unverified |
| PATCH `/admin/tax-classes/:id` **V** | settings.write | rateBps?,active?,verified? + reason | class; audit verify, bump policy |
| GET/POST `/admin/staff` | staff.manage | query hoặc email,name,role | list / 202 invite email |
| PATCH `/admin/staff/:id` **V** | staff.manage | role?,status?,reason | user; revoke sessions khi đổi quyền/disable |
| POST `/admin/staff/:id/mfa-reset` **I V** | staff.manage + recent MFA | reason | revoke sessions/MFA; cấm tự reset qua API |
| GET `/admin/audit-logs` | audit.read | actorId,resourceType,resourceId,from,to,pagination | redacted log entries |
| GET `/admin/reports/sales` | reports.read | from,to,groupBy=day,format=json/csv | metrics mục 5.9; max31days |
| GET `/admin/jobs` | audit.read | status,type,pagination | failures/age, redacted payload |
| POST `/admin/jobs/:id/replay` **I** | settings.write | reason | 202 chỉ failed/dead-letter; vẫn dedupe |
| GET `/health/live` | Infra, ngoài `/api/v1` | — | 200 process alive |
| GET `/health/ready` | Infra, ngoài `/api/v1` | — | 200 DB/schema usable, 503 draining/unavailable |
| GET `/openapi.json`, `/docs` | Dev hoặc authenticated staff | — | spec/UI; production policy rõ |

Staff invite token dùng purpose `staff_invite`, TTL 24 giờ, single-use. Thêm `POST /auth/staff-invite/accept` (anonymous session + CSRF, token/name/password) để activate account ở chế độ phải enroll MFA; không cho token chứa role do client điều khiển. Không cho disable/demote admin active cuối cùng; kiểm tra trong transaction để hai admin không tự loại quyền quản trị đồng thời.

`store_settings` cho store/checkout có tối thiểu: name, publicEmail, publicPhone, address, mapsUrl, socials, currency, timezone, termsVersion, checkoutEnabled, enabledPaymentMethods, manualDeliveryEnabled, liveDataApprovedAt, orderNoteLimit, fulfilmentPolicyVersion. Secret Stripe/SMTP/S3 lấy từ secret env, không sửa qua public/admin JSON.

## 11. Payload và luồng tích hợp mẫu

### 11.1. ProductView và cart

UUID mẫu chỉ minh họa, seed thực sinh ID ổn định qua UUIDv5 namespace của project hoặc lookup slug.

```json
{
  "data": {
    "id": "3d421df7-c5d1-4fc1-8d05-547e1cb1ac61",
    "sku": "SHOP-ORANGES",
    "slug": "oranges",
    "name": "Oranges",
    "summary": "Bright citrus for the fruit bowl, fresh juice and orange zest.",
    "category": { "slug": "fruit", "name": "Fruit" },
    "priceMinor": 690,
    "currency": "AUD",
    "unitLabel": "per kg",
    "sellUnit": "kg",
    "baseUnit": "g",
    "baseQuantity": 1000,
    "quantityRules": { "min": 1, "max": 99, "step": 1 },
    "imageUrl": null,
    "imageFit": "contain",
    "available": true,
    "version": 1
  },
  "requestId": "req_example"
}
```

Cart line response gồm `id, productId, productSummary, quantity, unitPriceMinor, lineTotalMinor, available, issues[]`; totals tên `estimatedTotals`, không gọi là final quote. Cart có `status, version, expiresAt`. Nếu product archived, giữ line và trả issue, cấm quote.

### 11.2. Quote delivery request

```json
{
  "cartId": "8ca62886-33c5-45b0-ac0b-52e9e31d35bf",
  "cartVersion": 3,
  "contact": {
    "name": "Demo Customer",
    "email": "customer@example.test",
    "phone": "+61400000000"
  },
  "fulfilment": "delivery",
  "slotId": "602c856e-5ac5-43fa-9b89-d3d283f9b0c3",
  "address": {
    "recipientName": "Demo Customer",
    "phone": "+61400000000",
    "line1": "1 Demo Street",
    "suburb": "Stirling",
    "state": "SA",
    "postcode": "5152",
    "country": "AU"
  },
  "note": "Please ring the doorbell.",
  "paymentMethod": "stripe",
  "termsVersion": "demo-1",
  "acceptedTerms": true
}
```

Quote response `data` bắt buộc: `id,cartId,cartVersion,expiresAt,contact,address,fulfilment,slot,paymentMethod,lines,totals,policyVersion,termsVersion`. Totals của ví dụ ở mục 6:

```json
{
  "currency": "AUD",
  "goodsSubtotalMinor": 2130,
  "discountMinor": 0,
  "shippingMinor": 1000,
  "taxTotalMinor": 0,
  "grandTotalMinor": 3130
}
```

### 11.3. Tạo đơn và khôi phục sau mất kết nối

```http
POST /api/v1/checkout/orders
Content-Type: application/json
Idempotency-Key: 92a69482-bf6e-46c5-9709-c259cab87b63
X-CSRF-Token: <token từ GET /session>
Cookie: <cookie do server set>

{"quoteId":"9675f1fc-d60f-46ee-a020-cc9828455b64"}
```

```json
{
  "data": {
    "orderId": "f02928ef-edcb-4ec6-964a-6b095d77e812",
    "orderNumber": "OM-20261009-7F4B92AC",
    "status": "pending_payment",
    "paymentStatus": "pending",
    "paymentSessionStatus": "creating",
    "grandTotalMinor": 3130,
    "currency": "AUD",
    "version": 1
  },
  "requestId": "req_example"
}
```

Nếu POST timeout, retry cùng key/payload: nhận đúng order đó. Không sinh key mới mỗi lần retry mạng. FE lấy payment-session endpoint, chỉ redirect tới URL provider đã được server tạo/kiểm tra host. Sau return, FE GET order; polling 2 giây trong tối đa 60 giây, sau đó hiển thị “đang xác nhận” và cho refresh. Không treo browser polling vô hạn.

### 11.4. Guest order recovery và privacy

Browser đã checkout đọc order nhờ guest session. Browser khác cần request access email, exchange token và session grant. Response public không cho tra bằng order number đơn thuần. Khi user đăng nhập, chỉ claim order của guest principal hiện có hoặc grant hợp lệ; action `POST /orders/:id/claim` yêu cầu customer session + guestClaimToken/order grant, **I**, trả 200 order đã gắn user hoặc 409 nếu owner khác. Tiêu thụ proof trong transaction.

### 11.5. Flow E2E tối thiểu

1. GET session → nhận cookie/CSRF; GET products.
2. POST cart → POST lines với cart version.
3. GET slots → POST quote; khách xem tổng tiền server và đồng ý terms.
4. POST order với idempotency; lưu orderId để retry/recover, không lưu toàn bộ PII trong localStorage.
5. Manual: admin accept → prepare → ready → mark collected → complete. Delivery có dispatch trước complete.
6. Stripe: worker tạo session → khách trả tiền sandbox → webhook → confirmed → fulfilment.
7. GET order từ owner; gửi email qua outbox; assertion tồn kho/capacity/payment/ledger đúng.

## 12. Bảo mật và dữ liệu cá nhân

Các quy tắc dưới đây là yêu cầu kỹ thuật của dự án, không phải chứng nhận tuân thủ pháp lý.

- Hash password bằng Argon2id với cấu hình tối thiểu đã kiểm tra theo hướng dẫn OWASP và benchmark trên host; lưu parameters trong hash để rehash khi login. Không mã hóa reversible password. [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
- Cookie/session rotation, revocation và timeout theo mục 5/9; token trong DB chỉ giữ hash. TOTP secret cần encryption vì phải verify, encryption key không nằm trong cùng DB dump. [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).
- Validate/allowlist DTO, parameterized queries, không nội suy raw SQL từ input. Raw SQL locking nếu cần phải parameterized.
- Helmet, tắt `X-Powered-By`, TLS termination, trust proxy chỉ topology đã cấu hình; không `trust proxy=true` tùy tiện rồi tin X-Forwarded-For client. [Express production security](https://expressjs.com/en/advanced/best-practice-security/).
- Rate limit dùng shared DB counters hoặc shared store, không chỉ in-memory khi nhiều instance. Default kỹ thuật: login 5 failures/15 phút theo email hash + 30/IP; forgot/verify 3/hour/email + 20/IP; enquiry 5/hour/session + 20/IP; checkout 10/minute/principal + 60/IP; read public 120/minute/IP. Tất cả configurable, trả Retry-After; webhook có policy riêng không làm mất event vì rate limit visitor.
- Không log body auth, Cookie, Authorization, CSRF, access token, card data hoặc contact/address đầy đủ. Log payment/order bằng ID và amount cần thiết. Redact raw webhook trước lưu audit; provider_events restricted access và retention riêng.
- Audit đổi giá/stock/quyền/settings/status/refund, bao gồm actor/action/target/reason/requestId; không đưa password/secret vào before/after. User business role không có UPDATE/DELETE audit rows.
- Webhook mount `express.raw({ type: 'application/json' })` đúng path **trước** global JSON parser; verify signature trên bytes nguyên bản. Async Express error middleware đặt cuối, có đủ `(err,req,res,next)`, xử lý headersSent đúng. [Express error handling](https://expressjs.com/en/guide/error-handling/).
- Không tạo endpoint gọi URL tùy ý từ user để fetch ảnh/payment; provider URLs allowlist, tránh SSRF. S3 bucket không public write.
- Generic responses cho password reset/access recovery/register để hạn chế enumeration. Áp cùng response shape/timing class, không hứa timing tuyệt đối bằng nhau.
- Data retention là cấu hình triển khai: session/token hết hạn purge sau grace 7 ngày; quote chưa consumed 30 ngày; enquiry 180 ngày; log kỹ thuật 30 ngày; provider payload 90 ngày là **default đề xuất**, chủ dự án cần review. Không tự purge orders/payment/audit bằng các giá trị này; production phải có policy riêng được duyệt trước bật cron xóa.
- Có CLI xuất/anonymize dữ liệu customer theo userId, dry-run mặc định, thao tác admin có audit; giữ financial record theo policy của tổ chức. Không đặt API xóa cứng toàn bộ user/orders cho tiện.

## 13. Tích hợp với frontend hiện tại

### 13.1. Ranh giới triển khai

BE Express chạy riêng được dù frontend giữ static export. Đặt public API base vào `NEXT_PUBLIC_API_BASE_URL`; đó là địa chỉ công khai, không phải nơi lưu secret. Nếu dùng proxy `/api` cùng origin cho FE static, cấu hình ở Nginx/CDN/hosting; không trông chờ Next rewrites runtime trong `output:'export'`.

Đã đọc guide cục bộ `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` của phiên bản source: server component được chạy lúc build; static export không cung cấp request-dependent server handlers/Server Actions. Vì vậy BE không được thiết kế dựa trên runtime Next hiện chưa tồn tại.

### 13.2. Mapping cụ thể

| FE source | Thay đổi cần làm khi nối API |
|---|---|
| `lib/catalog.ts` | Chuyển types sang generated API client; map `priceMinor` → `price` nếu cần adapter tạm; category object → tên hiển thị |
| `ShopCatalog` | Load API data, server pagination/filter/sort; giữ loading/error/empty riêng; disable add khi unavailable |
| `AddToBasket`, `CartProvider`, `BasketView` | Dùng cartId/lineId/productId/version; mutation server; không tính giá cuối từ localStorage |
| `CheckoutForm` | Contact validation, structured delivery address, slot selector, phương thức thanh toán, terms; quote review rồi submit |
| `OrderConfirmation` | Read order API + session; xử lý pending/payment fail; bỏ mã random và sessionStorage preview như nguồn thật |
| `AccountForm` | Call auth; verify/reset/email flows, lỗi field, pending state; min password đồng bộ |
| `Header` | Đọc `/session` hoặc `/me`; không truyền authenticated giả; bổ sung account page ở scope FE |
| `EnquiryForm` | POST API; success nói đã nhận enquiry; không nói “opens your email app” sau khi đã đổi hành vi |
| `CafeMenuSectionGrid` | Price integer + priceMode; labels verified; hiện vẫn display-only |
| `HoursTable`, contact/footer | GET store hoặc build-time snapshot có lịch refresh; không cache secrets |

**Đây là danh sách việc FE cho lần tích hợp, không phải thay UI trong lần viết tài liệu này.** BE alone không thể khiến login/order screen hiện tại tự hoạt động nếu chưa thay data layer.

### 13.3. Product slug và static export

`/shop/[slug]` hiện generate từ danh sách tĩnh. Sản phẩm tạo sau lần build sẽ không tự có HTML tại slug mới.

Mặc định giai đoạn nối CORE: giữ FE static, client-fetch catalog/giá/stock; mỗi thay đổi tập slug active cần CI rebuild FE từ public catalog API, có retry/alert. Không gửi URL sản phẩm mới cho public trước khi trang static được publish, hoặc dùng catalog popup làm điểm truy cập trong lúc chờ.

Nếu cần mọi slug xuất hiện tức thì và metadata luôn mới, chuyển FE sang Next server deployment trong nhiệm vụ riêng sau khi đọc docs đúng version. Không âm thầm bỏ static export chỉ để viết BE. Build FE không có API phải báo lỗi có ý nghĩa; production không fallback giá demo.

### 13.4. Chuyển dữ liệu trình duyệt

Sau consent thao tác user, đọc legacy localStorage `organic-market-basket`, gọi import một lần với idempotency. Các dòng shop resolve slug; café trả rejected reason; hiển thị sản phẩm đổi giá/unavailable. Chỉ xóa giỏ legacy sau import thành công và người dùng đã xử lý rejected lines. Không upload legacy `organic-market-order`; đó là preview, không phải lịch sử bán hàng.

## 14. Tác vụ nền, giám sát và phục hồi

### 14.1. Jobs bắt buộc

| Job | Tần suất mặc định | Điều kiện thành công |
|---|---|---|
| Dispatch outbox/email/payment session | poll 1 giây, batch25 | Claim lease, xử lý, ack; idempotent |
| Pending acceptance expiry | mỗi phút | Expire quá deadline, release đúng một lần |
| Pending payment reconciliation | mỗi phút | Retrieve trước release; không downgrade paid |
| Refund reconciliation | mỗi phút | Cập nhật provider status, retry bounded |
| Slot generation | mỗi giờ | Tạo rolling horizon 7 ngày, unique; không overwrite booked slot |
| Stock/slot invariant check | mỗi 15 phút | Report mismatch; không tự sửa ledger tiền/tồn thiếu bằng phỏng đoán |
| Cleanup token/session/rate buckets | mỗi ngày | TTL + grace, bounded batches |
| Cleanup media orphan | mỗi ngày | Asset unused vượt grace, đúng bucket/prefix của app |
| Retention/enquiry cleanup | mỗi ngày khi policy bật | Dry-run report trước enabling production |

Worker claim lease default 60 giây, heartbeat nếu xử lý dài; process crash để lease hết rồi worker khác retry. Tắt worker không làm đơn mất; backlog tăng và có alert. Không dùng một cron trong mỗi API instance gây nhân job.

### 14.2. Logs, metrics và SLO đề xuất

RequestId xuyên request → order event → outbox → provider call; JSON logs có timestamp, severity, route template, status, duration, actor ID pseudonymous. Metrics: request error/latency, DB pool, order create conflict, stock conflict, webhook age, oldest outbox age, payment pending age, refund pending age, email failure, worker heartbeat.

Mục tiêu nghiệm thu môi trường tham chiếu (không phải kết quả đã đo): API 2 vCPU/2 GiB, DB riêng, 1.000 products và 10.000 orders; read p95 <300 ms, cart mutation p95 <500 ms, submit DB phase p95 <1 giây tại 20 concurrent clients trong 5 phút, không tính provider redirect/email. Ghi dataset/host/error rate thực tế trong report; không tuyên bố đạt nếu chưa chạy.

Alert đề xuất: oldest outbox >5 phút, worker heartbeat >2 phút, payment hold unresolved >45 phút, refund pending >24 giờ, 5xx >2% trong 5 phút với đủ sample. Readiness không fail chỉ vì email/Stripe tạm lỗi nếu catalog vẫn có thể phục vụ; checkout cho phương thức lỗi trả trạng thái chính xác.

### 14.3. Backup và rollback

Production dùng managed DB backup/PITR nếu có. Mục tiêu đề xuất RPO ≤15 phút, RTO ≤4 giờ; phải diễn tập restore staging và ghi kết quả, không chỉ bật backup rồi coi là đạt. Object storage có versioning/lifecycle phù hợp và snapshot cấu hình ngoài secret.

Migration theo expand → backfill → switch → contract; rollback app phải tương thích schema còn tồn tại. Không rollback tài chính bằng xóa record; sửa bằng compensating movement/refund. Runbook phải mô tả DB down, provider down, webhook backlog, order stuck, oversell alert, email duplicate và secret rotation.

Graceful shutdown: readiness false, dừng nhận request mới, drain request trong 30 giây, dừng claim jobs, hoàn tất/nhả lease, disconnect DB. Container restart không được tự chạy seed/reset DB.

## 15. Môi trường và triển khai

### 15.1. Env contract

`.env.example` có comments và placeholder, không chứa secret thật. Validate khi startup; sai mode hoặc thiếu env bắt buộc phải fail rõ, không đoán default nguy hiểm.

| Variable | Local/demo | Production |
|---|---|---|
| NODE_ENV | development/test | production |
| APP_MODE | demo | live |
| PORT | 4000 | host-configured |
| DATABASE_URL | local PostgreSQL | secret connection TLS |
| PUBLIC_API_URL | http://localhost:4000 | HTTPS API origin |
| FRONTEND_URL | http://localhost:3000 | exact HTTPS FE origin |
| CORS_ORIGINS | localhost:3000 | comma-separated exact origins |
| TRUST_PROXY | explicit local false | exact proxy hops/CIDRs đã kiểm tra |
| SESSION_COOKIE_NAME | om_session_dev | __Host-om_session |
| TOKEN_HASH_SECRET | generated dev secret | secret ≥32 bytes, versioned rotation |
| DATA_ENCRYPTION_KEY | generated dev key | key để encrypt TOTP, tách backup DB |
| STORE_TIMEZONE / STORE_CURRENCY | Australia/Adelaide / AUD | khớp approved store config |
| CHECKOUT_ENABLED | true sau demo seed | false cho tới LIVE-GATE |
| PAYMENT_PROVIDER | fake hoặc stripe_test | stripe_live hoặc manual_only |
| STRIPE_SECRET_KEY | test secret khi có | live secret nếu stripe_live |
| STRIPE_WEBHOOK_SECRET | test webhook secret | live endpoint secret |
| STRIPE_API_VERSION | pinned verified version | cùng version đã test |
| SMTP_HOST / SMTP_PORT | mailpit / 1025 | provider-specific |
| SMTP_SECURE / SMTP_USER / SMTP_PASSWORD | false / empty | secret/TLS đúng provider |
| MAIL_FROM | demo@example.test | domain được xác thực |
| STORE_NOTIFICATION_EMAIL | store@example.test | mailbox cửa hàng duyệt |
| S3_ENDPOINT / S3_REGION / S3_BUCKET | local MinIO | provider endpoint/bucket riêng |
| S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY | generated demo | scoped secret |
| MEDIA_PUBLIC_BASE_URL | local bucket route | CDN HTTPS |
| LOG_LEVEL | debug/info | info; redaction luôn bật |
| RETENTION_ENABLED | false | chỉ bật sau policy review |

`PAYMENT_PROVIDER=fake` phải bị startup reject nếu `NODE_ENV=production` hoặc `APP_MODE=live`. Fake chỉ test/sandbox; không route public nhận arbitrary payment success. Demo emails gửi Mailpit, không gửi tới email/contact thật từ source. Checkout live chỉ bật nếu env **và** DB gate đều true, tránh admin bật nhầm khi hạ tầng chưa sẵn sàng.

### 15.2. Deployment topology và secrets

- FE static/CDN; reverse proxy route `/api/v1` và health về Express; `/webhooks` dùng path chính xác dưới API. TLS và body limit đồng bộ proxy/app.
- API và worker cùng release image, migrations chạy **một release job** trước rolling deploy; DB không public internet.
- Không expose Mailpit/MinIO console/Swagger không xác thực ở production. Object read chỉ đúng media bucket; database role app least privilege.
- Secret injection bằng hosting secrets, không commit `.env`; `.dockerignore` loại .env/node_modules/.git/test reports PII.
- CI không dùng production credentials. Stripe sandbox integration chạy job riêng có secret test; không chuyển tiền thật để test.
- Cấp phát provider và deploy thật là bước vận hành sau khi người dùng chọn môi trường. Tài liệu không giả định có tài khoản cloud/API bên thứ ba.

Compose local phải đặt rõ `NODE_ENV=development`, `APP_MODE=demo` kể cả khi chạy JavaScript đã compile; không kế thừa NODE_ENV=production của image rồi nới guard fake provider cho tiện. Production deploy dùng live config riêng và giữ guard nghiêm ngặt.

## 16. Ma trận kiểm thử

Test kiểm chứng invariant và hành vi; không chỉ mock repository rồi assert method được gọi. Database integration chạy PostgreSQL đúng major đã pin. Dùng fake clock để kiểm tra expiry, ngày store và DST.

| ID | Scenario | Kết quả bắt buộc | Loại |
|---|---|---|---|
| T01 | Register, verify single-use, login, logout | Hash đúng, token không tái dùng, session revoke | Integration |
| T02 | Reset password + session cũ | Token expire/replay fail; mọi session cũ mất quyền | Integration |
| T03 | Customer gửi role=admin / đổi ownerId | 422/403, không nâng quyền | Security integration |
| T04 | Guest/user A đọc cart/address/order B | 404; không lộ PII | Integration |
| T05 | CSRF thiếu/sai, CORS origin ngoài allowlist | Mutation bị chặn; webhook signed vẫn hoạt động | E2E |
| T06 | Cart import/merge retry 2 lần | Không double qty; conflict hiển thị đầy đủ | Integration |
| T07 | Hai tab cùng cart version sửa | Chỉ một thành công, tab cũ 412 | Concurrency |
| T08 | Client sửa giá/name/total | 422; order/Stripe dùng giá DB | Integration |
| T09 | Kg vs pack | qty2 oranges=2000g; qty2 milk=2 packs; totals chính xác | Unit + integration |
| T10 | Fractional/negative/NaN/huge qty, >50 lines | Reject rõ, không overflow | Property/unit + HTTP |
| T11 | Product archived/hết hàng sau add cart | Quote/submit chặn, không silently omit | Integration |
| T12 | Giá/tax/policy/cart đổi sau quote, quote expired | 409 và quote mới; không charge giá lạ | Integration |
| T13 | 20 request tranh mua 1 đơn vị | Đúng 1 order giữ hàng, 19 conflict, tồn không âm | Real DB concurrency |
| T14 | 20 request tranh slot còn 1 chỗ | Đúng 1 reservation, capacity không vượt | Real DB concurrency |
| T15 | Retry cùng key, timeout sau commit | Đúng 1 order, 1 reservation, 1 provider session | Fault injection |
| T16 | Cùng key payload khác / cùng quote key khác | 409 hoặc cùng order theo constraint; không tạo đơn thứ hai | Integration |
| T17 | Worker crash sau DB commit trước Stripe call | Outbox hồi phục, create session idempotent | Fault injection |
| T18 | Webhook chữ ký sai/body bị JSON parse trước | 400; không thay payment | Integration |
| T19 | Webhook duplicate/out-of-order | Một collection, một stock sale, không downgrade | Integration |
| T20 | Browser redirect success chưa webhook | Order vẫn pending; không coi paid | E2E |
| T21 | Provider timeout tại expiry | Không nhả hold còn rủi ro thu tiền; alert/reconcile | Integration |
| T22 | Paid đến sau cancellation/expiry | Không resurrect order; full refund workflow | Integration |
| T23 | Hủy và webhook success đồng thời | Một kết cục hợp lệ, không double release/refund | Concurrency |
| T24 | Staff hoàn tất unpaid / customer nhảy status | Reject PAYMENT_REQUIRED/FORBIDDEN | Integration |
| T25 | Manual collection retry | Một collection, đúng amount và reference | Integration |
| T26 | Full refund retry/provider failure | Không vượt collected, pending != refunded, reconciliation | Integration |
| T27 | Refund sau preparing / completed | Stock disposition rõ; không tự restock đồ đã chế biến | Integration |
| T28 | Zone không hỗ trợ, dưới minimum, free threshold | Fee/totals/error đúng boundary | Unit + integration |
| T29 | DST/exception/closed day/cutoff | Slot hợp lệ UTC, không ngoài giờ/đúp | Unit + integration |
| T30 | Menu dietary unverified, from-price | Hiển thị trạng thái đúng; café checkout CORE reject | Contract |
| T31 | Enquiry supply thiếu business, spam/retry | Validate; một enquiry; email qua outbox | Integration |
| T32 | SMTP down | Đơn/enquiry đã lưu; retry, không báo gửi thành công giả | Integration |
| T33 | Upload SVG/giả MIME/oversized/path traversal | Reject, không file executable/public write | Integration |
| T34 | Staff MFA chưa enroll, OTP replay, admin cuối | Không vào admin; không replay; giữ admin active cuối | Integration |
| T35 | Account/profile/giá thay đổi sau order | Snapshot order không đổi | Integration |
| T36 | Seed hai lần, migration DB trống/nâng cấp | Unique, data giữ nguyên, migrations pass | CI |
| T37 | OpenAPI/client schema và API runtime | Request/response contract không drift | Contract |
| T38 | Clean clone + local up + smoke | Không cần FE cũ/cloud credentials; health/docs/flow chạy | Acceptance |
| T39 | Report collections/refunds khác ngày | Net collected theo event date store đúng | Integration |
| T40 | Restore backup trên staging | DB/order/ledger recover, báo RPO/RTO thực đo | Operations |
| T41 | Fake provider + APP_MODE live | Startup fail | Config |
| T42 | Access token order sai purpose/replay/email không khớp | Không lộ/claim order; single-use | Security integration |
| T43 | Disable staff/đổi role giữa session | Session revoke, quyền mới có hiệu lực | Integration |
| T44 | Dead-letter replay và lease hai worker | Không thực thi effect hai lần; xử lý được sau crash | Integration |

Nghiệm thu CORE yêu cầu T01–T39 và T41–T44 qua; T40 là gate vận hành trước production. Stripe signed webhook local tests luôn chạy; live sandbox redirect/charge/refund cần Stripe test credentials. Thiếu credentials phải ghi **chưa xác minh tích hợp thật**, không đánh dấu test giả là test Stripe thật. Không yêu cầu 100% coverage mù quáng; các branch money/state/ownership/concurrency phải có case rõ.

## 17. Trình tự triển khai

| Chặng | Công việc cụ thể | Điều kiện ra chặng |
|---|---|---|
| P0 — Khởi tạo | Đọc repo đích, bảo vệ changes; pin runtime; Express app factory, config, errors, logger, Docker, DB | clean build, live/ready, env validation |
| P1 — Data foundation | Prisma schema/constraints/indexes, migration, demo seed, money/clock helpers | DB trống migrate được, seed idempotent, T09/T10/T36 |
| P2 — Auth | sessions, CSRF, register/verify/reset, customer profile/address, RBAC, MFA, bootstrap staff | T01–T05/T34/T42/T43 |
| P3 — Catalog/content | catalog/menu/store public + admin APIs, inventory adjustment, media | data seed đọc được, publish rules và upload tests |
| P4 — Cart/fulfilment | cart versioning/import/merge; zones/hours/exceptions/slots | T06/T07/T11/T28/T29 |
| P5 — Quote/order | server pricing, tax snapshots, transaction reservation, state machine, manual payment | T08–T16/T24/T25/T35 và manual E2E |
| P6 — Payments/worker | Stripe adapter, outbox, webhook inbox, expiry/cancel/refund/reconciliation | T17–T23/T26/T27/T44; sandbox evidence khi có key |
| P7 — Operations | enquiry/email, admin filters/events, reports/audit, retention commands | T31/T32/T39, permission matrix |
| P8 — Handoff | OpenAPI/generated client/examples, CI, load baseline, runbooks, acceptance | T30/T33/T37/T38/T41, báo cáo hoàn thành từng F/T |
| P9 — Production readiness | Configure real data/tax/zone/payment, domain/TLS, restore drill, FE integration | LIVE-GATE checklist pass; deployment được chủ dự án chọn |

P0–P8 là công việc agent phải làm trong lệnh build CORE. Không dừng sau scaffolding hoặc chỉ CRUD catalog. P9 phụ thuộc hệ thống/vận hành bên ngoài; thiếu dữ liệu ở P9 không ngăn hoàn tất local/test implementation. EXT-CAFE không chen vào các chặng này nếu chưa được yêu cầu.

Quản lý tiến độ bằng checklist theo F-* và T-* trong `docs/IMPLEMENTATION_STATUS.md`. Mỗi chặng ghi files, commands đã chạy, kết quả và rủi ro còn lại. Nếu phát hiện mâu thuẫn nghiệp vụ, ưu tiên CONFIRMED → default trong tài liệu → phương án nhỏ nhất an toàn; ghi quyết định vào `docs/DECISIONS.md`, không âm thầm đổi API.

## 18. Hợp đồng bàn giao và lệnh nghiệm thu

### 18.1. Artifact bắt buộc trong repo BE mới

1. Source Express API + worker chạy được; không còn stub success trong luồng CORE.
2. Prisma schema, migrations có constraints/indexes, seed từ mục 22.
3. `openapi.json` và Swagger UI; TypeScript client generated hoặc sample typed HTTP client dùng credential/CSRF đúng.
4. `.env.example`, Dockerfile, compose.yaml, `.dockerignore`, lockfile; dev provider setup tự động.
5. Test unit/integration/e2e/concurrency và fixtures; CI chạy lint/typecheck/build/migrations/tests.
6. `docs/FRONTEND_INTEGRATION.md` có mapping mục 13, examples quote/order/auth/guest recovery.
7. `docs/OPERATIONS.md`: deploy, backup/restore, secrets, stuck payment/refund, replay job, stock correction, rollback.
8. `docs/IMPLEMENTATION_STATUS.md`, `docs/DECISIONS.md`, `docs/ACCEPTANCE_REPORT.md`: không đánh đồng chưa chạy với đã pass.
9. HTTP collection trong `docs/api.http` hoặc Postman JSON, có bootstrap CSRF và các role; không chứa credentials thật.

### 18.2. npm scripts mà agent phải tạo

Các lệnh dưới đây là **hợp đồng của repo BE tương lai**, chưa tồn tại trong repo FE hiện tại. Agent phải implement script portable trên Windows/Linux bằng Node, không yêu cầu Bash. Docker Engine/Compose v2 và Node LTS đúng `.nvmrc`/engines là prerequisite.

| Script | Hành vi bắt buộc |
|---|---|
| `npm run local:up` | Tạo env demo nếu chưa có (không overwrite), secrets random, start db/mailpit/minio/init bucket, migrate, seed demo; fail rõ từng bước; không dùng production env |
| `npm run dev` | Watch Express API port4000 |
| `npm run dev:worker` | Watch worker process |
| `npm run lint` | ESLint, exit nonzero khi lỗi |
| `npm run typecheck` | TypeScript noEmit |
| `npm run build` | Generate Prisma client + build API/worker; không migrate/reset database |
| `npm start` | Chạy compiled API |
| `npm run start:worker` | Chạy compiled worker |
| `npm run db:migrate` | Áp migrations versioned trên target đã cấu hình, không tạo destructive reset |
| `npm run db:seed` | Demo-only seed idempotent; reject live |
| `npm run admin:create` | Interactive bootstrap one-time, email/password input; không password trong command history |
| `npm run test:unit` | Pure unit tests |
| `npm run test:integration` | Real PostgreSQL riêng cho test, migrations, integration/concurrency |
| `npm run test:e2e` | HTTP workflows trên isolated env, fake payments rõ ràng |
| `npm run test:stripe` | Sandbox provider integration; thiếu key exit rõ `not configured`, không báo pass |
| `npm run openapi:generate` | Xuất stable OpenAPI artifact |
| `npm run openapi:check` | Contract/spec validation, lỗi drift |
| `npm run smoke` | Health/catalog/session/cart/quote/manual order trong demo, verify DB effects |
| `npm run verify` | lint → typecheck → build → unit → integration → e2e → openapi:check; dừng khi fail |
| `npm run local:down` | Stop demo containers; giữ volumes, không xóa data |

Clean clone sau khi agent đã tạo source:

```bash
npm ci
npm run local:up
npm run verify
npm run dev
```

Trong terminal khác:

```bash
npm run dev:worker
```

Trong terminal thứ ba:

```bash
npm run smoke
```

Local docs tại `http://localhost:4000/docs`; Mailpit port và MinIO console được README của repo BE ghi đúng theo compose thực tế. Không tự gọi tài khoản email/Stripe live để chứng minh demo chạy.

Container smoke bổ sung sau build:

```bash
docker compose up --build -d
docker compose ps
npm run smoke
```

Compose phải tự đợi health DB và có one-shot migrations/init jobs; nếu local dev đã chiếm port4000 cần stop dev process trước. Không chạy hai API cùng port rồi báo lỗi cổng là lỗi nghiệp vụ.

### 18.3. Definition of Done

- Tất cả endpoint CORE trong mục 10 và các endpoint bổ sung mục 11 có OpenAPI + authorization + validation + tests tương ứng.
- Không fake order ID, không tin amount từ FE, không chỉ lưu đơn trong RAM, không disabled stock checks để test qua.
- Hai request đồng thời không oversell/overbook/double-charge/double-refund; rollback không để reservation mồ côi.
- Cùng snapshot tạo cùng amount; đơn cũ không đổi khi master data đổi.
- Manual E2E local hoàn tất được; Stripe adapter/webhook/refund có test và ghi rõ mức xác minh sandbox thực tế.
- Clean clone chạy bằng lệnh trên, DB rỗng migrate + seed không cần source FE cũ.
- Không secrets/PII thật trong repo/log/test reports; production chặn fake payment/demo seed.
- BE bàn giao có API contract và hướng dẫn nối FE; chưa nối FE thì báo rõ, không tuyên bố website hiện tại đã đặt đơn thật được.

## 19. Prompt dùng ở repository mới

Copy nguyên file `BACKEND_BLUEPRINT.md` vào root repo đích. Mở repo đó trong coding agent rồi gửi nguyên prompt sau. Đây là **lệnh giao việc cho agent**, không phải shell command. Nếu repo có sẵn code, agent phải đọc và tích hợp có kiểm soát, không xóa để scaffold lại.

```text
Hãy triển khai trọn bộ CORE backend được đặc tả trong BACKEND_BLUEPRINT.md
ngay tại repository hiện tại, từ khởi tạo đến kiểm thử và tài liệu bàn giao.

Yêu cầu bắt buộc:
1. Đọc toàn bộ BACKEND_BLUEPRINT.md, AGENTS.md và hiện trạng repo trước khi code.
   Dùng Node.js + Express.js 5, TypeScript strict ESM, PostgreSQL + Prisma.
   Không thay bằng NestJS/Next.js API. Pin phiên bản tương thích và lưu lockfile
   trong repository; không tự git commit/push nếu chưa được yêu cầu.
2. Coi CONFIRMED là yêu cầu chốt; dùng DEFAULT cho quyết định còn lại.
   Triển khai đủ CORE P0–P8; EXT-CAFE và các mục ngoài CORE không tự mở rộng.
   Có thể dùng dữ liệu demo/test để hoàn tất local; không giả dữ liệu đó là live.
3. Tạo checklist docs/IMPLEMENTATION_STATUS.md với F-* và T-*.
   Thực hiện tuần tự foundation, data, auth/RBAC/MFA, catalog/content,
   cart/fulfilment, checkout/order, payment/worker, operations, handoff.
   Không dừng ở plan, scaffold hoặc CRUD đơn giản.
4. Đảm bảo pricing do server quyết định; snapshot bất biến; transaction stock/slot;
   idempotency; guest ownership; session/CSRF; signed webhook raw body;
   cancellation/refund/reconciliation; outbox retry và audit.
   Không có stub trả success cho chức năng bắt buộc.
5. Dùng seed nhúng trong mục 22. Khi không có ảnh gốc, imageUrl=null và giữ
   sourceAssetPath như metadata import; không phụ thuộc đường dẫn máy/source cũ.
6. Tạo đủ artifacts và npm scripts ở mục 18, Docker Compose local và CI.
   Chạy lint/typecheck/build/unit/integration/e2e/OpenAPI checks trên PostgreSQL thật.
   Thực hiện concurrency tests cho stock, slot, submit, webhook và refunds.
7. Thiếu Stripe/SMTP/cloud credentials: hoàn tất adapter thật + fake adapter chỉ
   test, Mailpit local và test contracts; ghi chính xác phần chưa xác minh sandbox.
   Không giả nhận thanh toán/gửi email/deploy thật. Không dùng fake ở live mode.
8. Khi có mâu thuẫn làm thay đổi tiền, quyền hay contract, nêu rõ và ghi quyết định;
   tiếp tục công việc độc lập trong khi chờ thông tin. Không tự nới bảo mật để chạy.
9. Tôn trọng thay đổi có sẵn trong repo. Không xóa/reset database ngoài môi trường
   test được xác định; không tự tạo tài khoản trả phí, gửi email thật hoặc deploy live.
10. Bàn giao source chạy được, OpenAPI, API examples, hướng dẫn FE, runbook,
    acceptance report: endpoint/feature đã xong, commands và kết quả thực chạy,
    phần chưa chạy, live blockers và cách khởi động local.

Ưu tiên hoàn thành implementation và verification, không chỉ giải thích cách làm.
```

Nếu muốn nối frontend trong cùng repo đích, bổ sung yêu cầu riêng và source FE thực tế; file này đủ cho BE nhưng không chứa toàn bộ markup/assets frontend. Nếu muốn dùng JavaScript thuần thay TypeScript, đổi yêu cầu ngôn ngữ trong prompt và vẫn phải giữ validation runtime/OpenAPI/tests; runtime vẫn là Node.js + Express.js.

## 20. Checklist review của chủ dự án

### 20.1. Quyết định nghiệp vụ ảnh hưởng trực tiếp đến build

- [ ] Phạm vi CORE đúng; café hiện chỉ menu, chưa đặt nội bộ.
- [ ] Chấp nhận PostgreSQL/Prisma và TypeScript cho Express repo.
- [ ] Cho guest checkout; password min12, customer verification và staff MFA.
- [ ] Chấp nhận hàng per kg bán bước 1 kg, không điều chỉnh theo cân thực tế.
- [ ] Chọn phương thức manual/online và có dùng Stripe hay provider khác.
- [ ] Một quota tồn kho online, chưa đồng bộ POS/MyFoodLink/OrderUp.
- [ ] Hủy toàn đơn/refund toàn phần; chưa substitutions/partial refund.
- [ ] Supply là enquiry, chưa tạo subscription/B2B credit.
- [ ] Admin API trước; admin UI và màn account/slot/payment thuộc tích hợp FE.

### 20.2. Gate trước nhận đơn/tiền thật

- [ ] Duyệt catalog/55 giá demo, menu/43 giá demo; nhãn/dietary/ảnh được phép sử dụng.
- [ ] Xác định tax class/rate cho từng SKU và phí giao; cấu hình amount/receipt phù hợp.
- [ ] Duyệt giờ shop/café, exception dates, slot/capacity/cutoff, postcode/fee/minimum.
- [ ] Có stock online thật, quy trình cập nhật và xử lý thiếu hàng.
- [ ] Duyệt policies hủy/refund/no-show/delivery fail; termsVersion thật.
- [ ] Credentials provider test/live tách biệt; verify webhook/charge/refund sandbox.
- [ ] Email domain/recipients được duyệt, SPF/DKIM theo provider, không còn Mailpit ở live.
- [ ] Nhân sự và MFA, admin client để vận hành, training xử lý order/refund.
- [ ] FE đã thay preview/auth/mailto và kiểm thử end-to-end trên staging.
- [ ] Backup restore, alert, secret management, retention policy và runbook đã diễn tập.

Review có thể sửa các DEFAULT ngay trong file rồi dùng prompt. Những checkbox chưa duyệt không có nghĩa phải để code dang dở: hoàn thành sandbox và giữ checkout live disabled tới khi đủ cấu hình.

## 21. Nguồn tham chiếu

### 21.1. Bằng chứng nội bộ

Rà soát `package.json`, `next.config.ts`, `AGENTS.md`, toàn bộ các routes chức năng và components/data nêu ở mục 1. Đã xác định 55 products, 5 catalog categories, 43 café items, 5 café sections; không có backend persistence hiện hành trong source đã kiểm tra. Guide Next cục bộ dùng để đánh giá static-export integration, không dùng để dựng BE Express.

### 21.2. Tài liệu kỹ thuật chính thức đã đối chiếu

- [Express 5 migration](https://expressjs.com/en/guide/migrating-5/): breaking changes và routing compatibility.
- [Express error handling](https://expressjs.com/en/guide/error-handling/): async errors và error middleware.
- [Express security](https://expressjs.com/en/advanced/best-practice-security/): TLS, input, cookies và hardening.
- [Node.js release lifecycle](https://nodejs.org/en/about/previous-releases): chọn LTS được hỗ trợ khi implement, không hardcode “latest”.
- [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html): transaction/row locks và deadlock.
- [Prisma transactions](https://www.prisma.io/docs/orm/fundamentals/transactions): transaction boundary và concurrency.
- [Stripe webhooks](https://docs.stripe.com/webhooks): raw body signature, event retries và ordering.
- [OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html): session cookie và lifecycle.
- [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html): password hashing.

Các giới hạn nghiệp vụ, fees, TTL, capacity, scope và kiến trúc trong tài liệu là đề xuất cho dự án; không phải tất cả đều trích từ các nguồn này. Agent phải đọc docs đúng version lúc cài để tránh API đã đổi.

## 22. Dữ liệu seed độc lập

### 22.1. Cách sử dụng và các default

Các JSON dưới đây được trích từ source demo trong lần rà soát; chỉ dùng seed development/test. Không yêu cầu source cũ để dựng DB. Mỗi product nhận SKU `SHOP-` + slug uppercase, currency AUD, status active ở demo, version1, minQty1/maxQty99/stepQty1; tax class `DEMO-ZERO` rate0 chỉ dùng test, verified trong demo và không dùng production.

Mapping category slug: Fruit → `fruit`; Vegetables → `vegetables`; Chilled & Frozen → `chilled-frozen`; Bakery & Pantry → `bakery-pantry`; Drinks → `drinks`. Giữ thứ tự xuất hiện để làm sortOrder.

Mapping `unit`: `per kg` → sellUnit kg/baseUnit g/baseQuantity1000/onHand100000g; `each` → piece; `bunch` → bunch; `loaf` → loaf; các mô tả còn lại → pack. Với count, baseQuantity1/onHand100 count. Tất cả reserved0. Đây là tồn kho thử, không phải số lượng cửa hàng thực có.

Giữ `sourceAssetPath` để phục vụ import ảnh khi sau này có asset bundle. Không mount đường dẫn này làm dependency BE; `mediaId=null` cho tới khi upload/import ảnh thành công. Seed không tải ảnh từ website ngoài hoặc invent URL.

Café: stable slug tạo từ sectionId + tên latin lowercase hyphen; name/description giữ nguyên, priceMinor đã chuẩn hóa, dietary verification `unverified`; không tự thêm nhãn. Section/item chỉ display. Khóa seed dùng slug để chạy lặp không duplicate.

Store demo lấy name/address/phone như bằng chứng source, timezone Australia/Adelaide/currency AUD; emails gửi tới `store@example.test`. Giờ nguồn ghi dạng `8:00–5:00` được **diễn giải** thành shop Mon–Fri 08:00–17:00; weekend 08:00–16:30; café Mon–Fri 08:00–16:30; weekend 08:00–16:00. Production cần duyệt lại. Không seed exception public holiday nếu chưa có ngày cụ thể.

Demo users: tạo customer active bằng seed với mật khẩu random in ra terminal một lần hoặc đọc env demo; bootstrap admin bằng CLI riêng, không hardcode password dùng chung. Demo enquiry và order có thể tạo bằng smoke test trên dữ liệu tổng hợp; không dùng PII khách thật.

### 22.2. Catalog: 55 products

<!-- SEED_PRODUCTS_START -->
```json
[
  {"slug":"oranges","name":"Oranges","category":"Fruit","unit":"per kg","summary":"Bright citrus for the fruit bowl, fresh juice and orange zest.","imageFit":"contain","priceMinor":690,"sourceAssetPath":"/assets/fruit/1.webp"},
  {"slug":"mandarins","name":"Mandarins","category":"Fruit","unit":"per kg","summary":"Easy-peel citrus with juicy segments for lunchboxes and snacks.","imageFit":"contain","priceMinor":790,"sourceAssetPath":"/assets/fruit/2.webp"},
  {"slug":"watermelon","name":"Watermelon","category":"Fruit","unit":"per kg","summary":"A refreshing melon with crisp red flesh, ready to slice and share.","imageFit":"contain","priceMinor":390,"sourceAssetPath":"/assets/fruit/4.webp"},
  {"slug":"pineapple","name":"Pineapple","category":"Fruit","unit":"each","summary":"Golden tropical fruit for fruit salads, smoothies or grilling.","imageFit":"contain","priceMinor":850,"sourceAssetPath":"/assets/fruit/5.webp"},
  {"slug":"pears","name":"Pears","category":"Fruit","unit":"per kg","summary":"Blush-skinned pears for snacking, poaching and baking.","imageFit":"contain","priceMinor":790,"sourceAssetPath":"/assets/fruit/6.webp"},
  {"slug":"avocado","name":"Avocado","category":"Fruit","unit":"each","summary":"Creamy avocado for toast, salads and homemade guacamole.","imageFit":"contain","priceMinor":350,"sourceAssetPath":"/assets/fruit/7.webp"},
  {"slug":"striped-apples","name":"Striped apples","category":"Fruit","unit":"per kg","summary":"Red-and-gold apples for the fruit bowl, lunchbox or baking tray.","imageFit":"contain","priceMinor":890,"sourceAssetPath":"/assets/fruit/8.webp"},
  {"slug":"lemons","name":"Lemons","category":"Fruit","unit":"per kg","summary":"Fresh lemons for dressings, baking and a squeeze over dinner.","imageFit":"contain","priceMinor":580,"sourceAssetPath":"/assets/fruit/9.webp"},
  {"slug":"red-apples","name":"Red apples","category":"Fruit","unit":"per kg","summary":"Red-skinned apples for everyday snacking and fresh fruit salads.","imageFit":"contain","priceMinor":890,"sourceAssetPath":"/assets/fruit/10.webp"},
  {"slug":"carrots","name":"Carrots","category":"Vegetables","unit":"per kg","summary":"Everyday carrots for roasting, grating into salads and slow-cooked soups.","imageFit":"contain","priceMinor":490,"sourceAssetPath":"/assets/product/1.webp"},
  {"slug":"broccoli","name":"Broccoli","category":"Vegetables","unit":"per kg","summary":"Green broccoli florets for steaming, roasting and quick stir-fries.","imageFit":"contain","priceMinor":890,"sourceAssetPath":"/assets/product/2.webp"},
  {"slug":"potatoes","name":"Potatoes","category":"Vegetables","unit":"per kg","summary":"A kitchen staple for mash, roast potatoes and comforting soups.","imageFit":"contain","priceMinor":590,"sourceAssetPath":"/assets/product/3.webp"},
  {"slug":"brown-onions","name":"Brown onions","category":"Vegetables","unit":"per kg","summary":"Brown onions for the base of soups, sauces and everyday cooking.","imageFit":"contain","priceMinor":490,"sourceAssetPath":"/assets/product/4.webp"},
  {"slug":"cucumber","name":"Cucumber","category":"Vegetables","unit":"each","summary":"Crisp cucumber for salads, sandwiches and cool summer sides.","imageFit":"contain","priceMinor":350,"sourceAssetPath":"/assets/product/5.webp"},
  {"slug":"sweet-potatoes","name":"Sweet potatoes","category":"Vegetables","unit":"per kg","summary":"Orange-fleshed sweet potatoes for roasting, mashing and wedges.","imageFit":"contain","priceMinor":690,"sourceAssetPath":"/assets/product/6.webp"},
  {"slug":"cauliflower","name":"Cauliflower","category":"Vegetables","unit":"each","summary":"A whole cauliflower for roasted florets, creamy soups and baked dishes.","imageFit":"contain","priceMinor":790,"sourceAssetPath":"/assets/product/7.webp"},
  {"slug":"cherry-tomatoes","name":"Cherry tomatoes","category":"Vegetables","unit":"250 g punnet","summary":"Small red tomatoes for salads, lunchboxes and quick pasta sauces.","imageFit":"contain","priceMinor":590,"sourceAssetPath":"/assets/product/8.webp"},
  {"slug":"butternut-pumpkin","name":"Butternut pumpkin","category":"Vegetables","unit":"per kg","summary":"Golden-fleshed pumpkin for roasting, soups and warming curries.","imageFit":"contain","priceMinor":490,"sourceAssetPath":"/assets/product/9.webp"},
  {"slug":"silverbeet","name":"Silverbeet","category":"Vegetables","unit":"bunch","summary":"Leafy greens with pale stems for pies, sautés and hearty soups.","imageFit":"contain","priceMinor":490,"sourceAssetPath":"/assets/product/10.webp"},
  {"slug":"red-onions","name":"Red onions","category":"Vegetables","unit":"per kg","summary":"Red onions for salads, pickling and caramelising in the pan.","imageFit":"contain","priceMinor":590,"sourceAssetPath":"/assets/product/11.webp"},
  {"slug":"brussels-sprouts","name":"Brussels sprouts","category":"Vegetables","unit":"per kg","summary":"Compact green sprouts for roasting or shredding into a crunchy slaw.","imageFit":"contain","priceMinor":1190,"sourceAssetPath":"/assets/product/12.webp"},
  {"slug":"fennel","name":"Fennel","category":"Vegetables","unit":"each","summary":"A crisp fennel bulb with leafy fronds for salads and roasting.","imageFit":"contain","priceMinor":590,"sourceAssetPath":"/assets/product/13.webp"},
  {"slug":"green-leaf-lettuce","name":"Green leaf lettuce","category":"Vegetables","unit":"each","summary":"Tender green leaves for fresh salads, wraps and sandwiches.","imageFit":"contain","priceMinor":450,"sourceAssetPath":"/assets/product/15.webp"},
  {"slug":"paris-creek-milk","name":"Paris Creek cream-on-top milk","category":"Chilled & Frozen","unit":"2 litres","summary":"Paris Creek Farms organic cream-on-top milk from the dairy fridge.","imageFit":"contain","priceMinor":750,"sourceAssetPath":"/assets/chiller/1.webp"},
  {"slug":"elgin-garden-peas","name":"Elgin organic garden peas","category":"Chilled & Frozen","unit":"600 g","summary":"Frozen garden peas for quick sides, soups and weeknight dinners.","imageFit":"contain","priceMinor":690,"sourceAssetPath":"/assets/chiller/2.webp"},
  {"slug":"elgin-wild-blueberries","name":"Elgin organic wild blueberries","category":"Chilled & Frozen","unit":"1 kg","summary":"Frozen wild blueberries for smoothies, breakfast bowls and baking.","imageFit":"contain","priceMinor":2290,"sourceAssetPath":"/assets/chiller/3.webp"},
  {"slug":"barambah-cheddar-slices","name":"Barambah tasty cheddar slices","category":"Chilled & Frozen","unit":"210 g","summary":"Sliced organic tasty cheddar for sandwiches, toasties and burgers.","imageFit":"contain","priceMinor":790,"sourceAssetPath":"/assets/chiller/4.webp"},
  {"slug":"barambah-shredded-cheddar","name":"Barambah shredded tasty cheddar","category":"Chilled & Frozen","unit":"250 g","summary":"Shredded organic cheddar for pasta bakes, pizzas and toasties.","imageFit":"contain","priceMinor":890,"sourceAssetPath":"/assets/chiller/5.webp"},
  {"slug":"chicken-thigh-fillets","name":"Organic chicken thigh fillets","category":"Chilled & Frozen","unit":"500 g pack","summary":"Chicken thigh fillets for curries, tray bakes and pan-fried meals.","imageFit":"contain","priceMinor":1490,"sourceAssetPath":"/assets/chiller/6.webp"},
  {"slug":"savoury-pasty","name":"Savoury pasty","category":"Chilled & Frozen","unit":"each","summary":"A golden folded pastry for an easy lunch, served warm with a side salad.","imageFit":"contain","priceMinor":790,"sourceAssetPath":"/assets/chiller/7.webp"},
  {"slug":"true-organic-salted-butter","name":"True Organic salted butter","category":"Chilled & Frozen","unit":"250 g","summary":"Salted butter for spreading, cooking and everyday baking.","imageFit":"contain","priceMinor":790,"sourceAssetPath":"/assets/chiller/8.webp"},
  {"slug":"elgin-blackberries","name":"Elgin organic blackberries","category":"Chilled & Frozen","unit":"1 kg","summary":"Frozen blackberries for crumbles, smoothies and berry compotes.","imageFit":"contain","priceMinor":1990,"sourceAssetPath":"/assets/chiller/9.webp"},
  {"slug":"barambah-lactose-free-yoghurt","name":"Barambah lactose-free natural yoghurt","category":"Chilled & Frozen","unit":"500 g","summary":"Natural organic pot-set yoghurt from the Barambah dairy range.","imageFit":"contain","priceMinor":750,"sourceAssetPath":"/assets/chiller/10.webp"},
  {"slug":"made-by-cow-milk","name":"Made By Cow cold-pressed raw milk","category":"Chilled & Frozen","unit":"1.5 litres","summary":"Jersey milk from the Made By Cow cold-pressed range. Keep refrigerated.","imageFit":"contain","priceMinor":850,"sourceAssetPath":"/assets/chiller/11.webp"},
  {"slug":"mungalli-high-protein-yoghurt","name":"Mungalli high-protein natural yoghurt","category":"Chilled & Frozen","unit":"500 g tub","summary":"Natural organic yoghurt from the Mungalli high-protein range.","imageFit":"contain","priceMinor":1090,"sourceAssetPath":"/assets/chiller/12.webp"},
  {"slug":"nut-and-seed-slice","name":"Nut and seed slice","category":"Chilled & Frozen","unit":"each","summary":"A crunchy slice topped with mixed nuts and seeds, ready for a snack.","imageFit":"cover","priceMinor":550,"sourceAssetPath":"/assets/chiller/13.webp"},
  {"slug":"viking-stir-fry-mix","name":"Viking organic stir-fry mix","category":"Chilled & Frozen","unit":"500 g","summary":"A frozen vegetable mix ready for the wok and quick weeknight meals.","imageFit":"contain","priceMinor":790,"sourceAssetPath":"/assets/chiller/14.webp"},
  {"slug":"mungalli-natural-yoghurt","name":"Mungalli natural organic yoghurt","category":"Chilled & Frozen","unit":"500 g tub","summary":"Natural organic yoghurt for breakfast bowls, dips and dressings.","imageFit":"contain","priceMinor":890,"sourceAssetPath":"/assets/chiller/15.webp"},
  {"slug":"spelt-sourdough-loaf","name":"Spelt sourdough loaf","category":"Bakery & Pantry","unit":"loaf","summary":"A spelt loaf for everyday toast, sandwiches and the bread basket.","imageFit":"contain","priceMinor":1090,"sourceAssetPath":"/assets/supplements/1.webp"},
  {"slug":"ancient-grains-rye-sourdough","name":"Ancient Grains organic rye sourdough","category":"Bakery & Pantry","unit":"loaf","summary":"A rye sourdough loaf for toast and open sandwiches.","imageFit":"contain","priceMinor":1150,"sourceAssetPath":"/assets/supplements/2.webp"},
  {"slug":"venerdi-sweet-potato-buns","name":"Venerdi sweet potato sourdough buns","category":"Bakery & Pantry","unit":"pack","summary":"Gluten Freedom sweet potato sourdough buns for burgers and lunch rolls.","imageFit":"contain","priceMinor":990,"sourceAssetPath":"/assets/supplements/3.webp"},
  {"slug":"wholemeal-spelt-rolls","name":"Wholemeal spelt rolls","category":"Bakery & Pantry","unit":"6 pack","summary":"Soft wholemeal spelt rolls for lunchboxes, picnics and the dinner table.","imageFit":"contain","priceMinor":850,"sourceAssetPath":"/assets/supplements/4.webp"},
  {"slug":"dona-cholita-white-corn-totopos","name":"Doña Cholita white corn totopos","category":"Bakery & Pantry","unit":"170 g","summary":"White corn tortilla chips cooked in avocado oil, ready for salsa and dips.","imageFit":"contain","priceMinor":790,"sourceAssetPath":"/assets/supplements/5.webp"},
  {"slug":"proper-crisps-sea-salt","name":"Proper Crisps Marlborough sea salt","category":"Bakery & Pantry","unit":"150 g","summary":"Hand-cooked potato crisps seasoned with Marlborough sea salt.","imageFit":"contain","priceMinor":650,"sourceAssetPath":"/assets/supplements/6.webp"},
  {"slug":"ceres-quinoa-brown-rice-crackers","name":"Ceres quinoa & brown rice crackers","category":"Bakery & Pantry","unit":"pack","summary":"Quinoa and brown rice crackers for snacking and sharing with dips.","imageFit":"contain","priceMinor":490,"sourceAssetPath":"/assets/supplements/7.webp"},
  {"slug":"seeded-flatbread","name":"Seeded flatbread","category":"Bakery & Pantry","unit":"each","summary":"A seed-topped flatbread to serve with dips, soup or a fresh salad.","imageFit":"contain","priceMinor":690,"sourceAssetPath":"/assets/supplements/8.webp"},
  {"slug":"venerdi-seeded-sourdough","name":"Venerdi seeded sourdough bread","category":"Bakery & Pantry","unit":"loaf","summary":"A seeded loaf from the Venerdi Gluten Freedom sourdough range.","imageFit":"contain","priceMinor":1190,"sourceAssetPath":"/assets/supplements/9.webp"},
  {"slug":"ancient-grains-spelt-loaf","name":"Ancient Grains organic spelt loaf","category":"Bakery & Pantry","unit":"loaf","summary":"A wholemeal spelt loaf for breakfast toast and everyday sandwiches.","imageFit":"contain","priceMinor":1090,"sourceAssetPath":"/assets/supplements/10.webp"},
  {"slug":"honest-to-goodness-coconut-milk","name":"Honest to Goodness organic coconut milk","category":"Bakery & Pantry","unit":"400 ml","summary":"Canned coconut milk for curries, soups, sauces and desserts.","imageFit":"contain","priceMinor":390,"sourceAssetPath":"/assets/supplements/11.webp"},
  {"slug":"la-tortilleria-tortilla-chips","name":"La Tortilleria tortilla chips","category":"Bakery & Pantry","unit":"200 g","summary":"Corn tortilla chips for nachos or a bowl of fresh guacamole.","imageFit":"contain","priceMinor":690,"sourceAssetPath":"/assets/supplements/12.webp"},
  {"slug":"naturis-rice-loaf","name":"Naturis gluten-free rice loaf","category":"Bakery & Pantry","unit":"680 g","summary":"A rice loaf from the Naturis range, ready to slice and toast.","imageFit":"contain","priceMinor":990,"sourceAssetPath":"/assets/supplements/13.webp"},
  {"slug":"passata","name":"Global Organics tomato purée","category":"Bakery & Pantry","unit":"bottle","summary":"Bottled tomato purée for pasta sauces, soups and slow-cooked dishes.","imageFit":"contain","priceMinor":490,"sourceAssetPath":"/assets/supplements/14.webp"},
  {"slug":"food-to-nourish-cacao-hazelnut-clusters","name":"Food to Nourish cacao & hazelnut clusters","category":"Bakery & Pantry","unit":"pack","summary":"Sprouted cacao and hazelnut clusters for breakfast bowls or snacking.","imageFit":"contain","priceMinor":1290,"sourceAssetPath":"/assets/supplements/15.webp"},
  {"slug":"apple-juice","name":"Apple juice","category":"Drinks","unit":"1 litre","summary":"A fruity apple juice to serve chilled with breakfast or lunch.","imageFit":"contain","priceMinor":750,"sourceAssetPath":"/assets/fruit/3.webp"},
  {"slug":"carrot-juice","name":"Carrot juice","category":"Drinks","unit":"500 ml","summary":"Bright carrot juice for a refreshing drink, served chilled.","imageFit":"contain","priceMinor":750,"sourceAssetPath":"/assets/product/14.webp"}
]
```
<!-- SEED_PRODUCTS_END -->

### 22.3. Café: 5 sections, 43 items

<!-- SEED_CAFE_START -->
```json
[
  {
    "id": "breakfast",
    "title": "Breakfast",
    "note": "All day",
    "imageAlt": "Shakshouka",
    "sourceAssetPath": "/assets/coffee/breakfast/1.jpg",
    "items": [
      {"name":"Shakshouka","description":"Egg baked in a rich tomato and capsicum sauce, finished with herbs and served with toasted sourdough.","priceMinor":2475,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/breakfast/1.jpg"},
      {"name":"Avocado & feta toast","description":"Avocado and crumbled feta on rye toast, topped with leafy greens and a sprinkle of dukkah.","priceMinor":1700,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/breakfast/2.jpg"},
      {"name":"Mushroom confit","description":"Roasted mushrooms on sourdough with creamy feta, rocket and pickled red onion.","priceMinor":2100,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/breakfast/3.jpg"},
      {"name":"Toasted muesli bowl","description":"Toasted muesli with yoghurt, fresh strawberries, coconut flakes and nuts.","priceMinor":1750,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/breakfast/4.jpg"},
      {"name":"Banana & coconut porridge","description":"A warming breakfast bowl topped with banana, coconut flakes, nuts and rose petals.","priceMinor":1600,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/breakfast/5.jpg"},
      {"name":"Sourdough toast","description":"Two slices of toasted sourdough with butter and a side of fruit preserve.","priceMinor":900,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/breakfast/6.jpg"}
    ]
  },
  {
    "id": "lunch",
    "title": "Lunch",
    "note": "All day; salad bowl from 11am",
    "imageAlt": "Roast pumpkin salad bowl",
    "sourceAssetPath": "/assets/coffee/lunch/1.jpg",
    "items": [
      {"name":"Roast pumpkin salad bowl","description":"A generous wedge of roasted pumpkin with a colourful selection of seasonal salads.","priceMinor":2250,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/lunch/1.jpg"},
      {"name":"Market tasting platter","description":"A selection of dips, olives, cheese, crisp vegetables and toasted bread for grazing.","priceMinor":2200,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/lunch/2.jpg"},
      {"name":"Tomato & olive bruschetta","description":"Toasted sourdough with rich tomato sauce, olives, grated parmesan and fresh herbs.","priceMinor":1300,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/lunch/3.jpg"},
      {"name":"Haloumi & salsa bruschetta","description":"Golden grilled haloumi on sourdough with fresh tomato salsa and a lemon wedge.","priceMinor":1700,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/lunch/4.jpg"},
      {"name":"Pumpkin & feta bruschetta","description":"Roast pumpkin and capsicum on toast, finished with crumbled feta and herbs.","priceMinor":1700,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/lunch/5.jpg"},
      {"name":"Ham & cheddar focaccia","description":"A seeded focaccia filled with ham, cheddar, chutney and pickled onion, with leafy greens.","priceMinor":1900,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/lunch/6.jpg"},
      {"name":"Roast eggplant focaccia","description":"Roasted eggplant, tahini sauce and fresh tabouli in a seeded focaccia, with a side salad.","priceMinor":1700,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/lunch/7.jpg"},
      {"name":"Tomato & bocconcini focaccia","description":"Basil pesto, sliced tomato, olives and bocconcini in a toasted focaccia.","priceMinor":1700,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/lunch/8.jpg"},
      {"name":"Smoked salmon focaccia","description":"Smoked salmon, cream cheese, leafy greens and pickled red onion in a seeded focaccia.","priceMinor":2250,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/lunch/9.jpg"},
      {"name":"Roast vegetable wrap","description":"A toasted wrap filled with roast vegetables, grated carrot and fresh greens, with salad on the side.","priceMinor":1700,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/lunch/10.jpg"},
      {"name":"Scone with jam & cream","description":"A freshly baked scone dusted with icing sugar, served with berry jam and cream.","priceMinor":850,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/lunch/11.jpg"}
    ]
  },
  {
    "id": "cakes",
    "title": "Cakes & sweet treats",
    "note": "From the café cabinet",
    "imageAlt": "Almond biscuit",
    "sourceAssetPath": "/assets/coffee/cake/1.png",
    "items": [
      {"name":"Almond biscuit","description":"A golden biscuit topped with flaked almonds, ready to pair with your coffee.","priceMinor":425,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cake/1.png"},
      {"name":"Apple crumble cake","description":"A slice of apple cake with a crumbly topping, dusted with icing sugar and served with cream.","priceMinor":850,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cake/2.jpg"},
      {"name":"Banana bread","description":"A thick slice of banana bread, lightly warmed and served with butter.","priceMinor":850,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cake/3.jpg"},
      {"name":"Classic cream tea scone","description":"A soft scone with a dusting of icing sugar, berry jam and a generous spoonful of cream.","priceMinor":850,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cake/4.jpg"},
      {"name":"Chocolate caramel slice","description":"A rich chocolate slice with a smooth caramel topping, served with cream.","priceMinor":850,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cake/5.jpg"},
      {"name":"YoYo biscuit","description":"A buttery sandwich biscuit with a creamy filling and a dusting of icing sugar.","priceMinor":550,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cake/6.jpg"}
    ]
  },
  {
    "id": "coffee",
    "title": "Coffee & warm drinks",
    "imageAlt": "Flat white",
    "sourceAssetPath": "/assets/coffee/cafe/1.jpg",
    "items": [
      {"name":"Flat white","description":"Espresso with silky steamed milk and a fine layer of microfoam.","priceMinor":550,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/1.jpg"},
      {"name":"Latte","description":"A smooth espresso and steamed milk, served in a glass with latte art.","priceMinor":550,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/2.jpg"},
      {"name":"Piccolo","description":"A small espresso-based coffee with steamed milk, served in a short glass.","priceMinor":475,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/3.jpg"},
      {"name":"Long black","description":"Espresso poured over hot water for a full-flavoured black coffee.","priceMinor":475,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/4.jpg"},
      {"name":"Espresso","description":"A short, concentrated coffee with a golden crema.","priceMinor":475,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/5.jpg"},
      {"name":"Macchiato","description":"Espresso marked with a little steamed milk, served in a small glass.","priceMinor":475,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/6.jpg"},
      {"name":"Vienna coffee","description":"A black coffee served with a side of whipped cream and a dusting of chocolate.","priceMinor":650,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/7.jpg"},
      {"name":"Chai latte","description":"Spiced chai with steamed milk and a light cinnamon dusting.","priceMinor":600,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/8.jpg"},
      {"name":"Pot chai","description":"Spiced milk chai served in a pot with a strainer and honey on the side.","priceMinor":800,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/9.jpg"},
      {"name":"Hot chocolate","description":"A comforting cup of chocolate and steamed milk, finished with cocoa.","priceMinor":550,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/10.jpg"},
      {"name":"Premium drinking chocolate","description":"A rich drinking chocolate with steamed milk and a generous cocoa topping.","priceMinor":600,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/11.jpg"},
      {"name":"Pot of tea","description":"Your choice of tea, served in a teapot with milk on the side.","priceMinor":550,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/12.jpg"},
      {"name":"Golden milk","description":"A gently spiced turmeric milk with a foamy top, served warm in a glass.","priceMinor":600,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/cafe/13.jpg"}
    ]
  },
  {
    "id": "cold-drinks",
    "title": "Cold drinks",
    "note": "Juices, smoothies & iced favourites",
    "imageAlt": "Cold-pressed juice",
    "sourceAssetPath": "/assets/coffee/drink/1.jpg",
    "items": [
      {"name":"Cold-pressed juice","description":"A glass of fresh fruit and vegetable juice; choose a seasonal red, orange or green blend.","priceMinor":1000,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/drink/1.jpg"},
      {"name":"Orange juice","description":"Fresh orange juice, served chilled with a slice of citrus.","priceMinor":900,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/drink/2.jpg"},
      {"name":"Apple juice","description":"Refreshing apple juice, served chilled with a crisp apple garnish.","priceMinor":650,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/drink/3.jpg"},
      {"name":"Mango smoothie","description":"A creamy mango smoothie, blended and served chilled.","priceMinor":1150,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/drink/4.jpg"},
      {"name":"Iced coffee","description":"Chilled coffee with milk and a creamy topping, served in a tall glass.","priceMinor":1000,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/drink/5.jpg"},
      {"name":"Iced chocolate","description":"Chocolate and cold milk with a creamy topping and a fresh strawberry garnish.","priceMinor":1000,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/drink/6.jpg"},
      {"name":"Berry lemonade spider","description":"A fizzy lemonade float with berries and ice cream, finished with a fresh strawberry.","priceMinor":1000,"priceMode":"fixed","sourceAssetPath":"/assets/coffee/drink/7.jpg"}
    ]
  }
]
```
<!-- SEED_CAFE_END -->

### 22.4. Fixture phục vụ kiểm thử

Sau seed tạo tối thiểu ba kịch bản bổ sung bằng test factory: SKU chỉ còn 1 count để test oversell, slot capacity1 để test overbook, product archived và product có price đổi giữa quote/submit. Test dùng `example.test`, không gửi ra contact thật. Giá/stock test reset chỉ trong database test riêng có guard tên DB và APP_MODE; tuyệt đối không chạy reset từ `DATABASE_URL` live.
