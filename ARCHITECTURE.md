# Software Architecture & Design Patterns (SADP) Specification
## Kids Wear E-Commerce Platform (with Cash on Delivery - COD)

This project is built using **Next.js (App Router)** following the **Software Architecture & Design Patterns (SADP)** principles.

---

### 1. Architectural Style: Layered (Clean / N-Tier Architecture)

The codebase enforces strict separation of concerns into distinct layers:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Presentation & Delivery Layer                            │
│    (Next.js App Router, React Components, Atomic Design,    │
│     Zustand / React Context for Cart, Tailwind CSS)         │
└──────────────────────────┬──────────────────────────────────┘
                           │ calls
┌──────────────────────────▼──────────────────────────────────┐
│ 2. Domain / Core Business Rules                             │
│    (Pure TypeScript Entities, Use Cases, Sizing Rules,      │
│     COD Thresholds & Fraud Prevention Logic)                │
└──────────────────────────┬──────────────────────────────────┘
                           │ coordinates
┌──────────────────────────▼──────────────────────────────────┐
│ 3. Infrastructure & Patterns Layer                          │
│    (Design Pattern Implementations: Factory, Strategy,      │
│     Facade, Adapter, Repository, Observer, Singleton)       │
└──────────────────────────┬──────────────────────────────────┘
                           │ utilizes
┌──────────────────────────▼──────────────────────────────────┐
│ 4. Cross-Cutting / Shared Utilities                         │
│    (Enums, Currency Formatter, Global Types)                │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Design Patterns (GoF) Mapped to Files

| Pattern Category | Pattern Name | Implementation File | Purpose in Kids Wear & COD Domain |
| :--- | :--- | :--- | :--- |
| **Creational** | **Factory Pattern** | `src/infrastructure/patterns/creational/PaymentFactory.ts` | Dynamically instantiates the correct payment handler (`CashOnDeliveryStrategy` or `OnlinePaymentStrategy`) without coupling client code to concrete classes. |
| **Creational** | **Builder Pattern** | `src/infrastructure/patterns/creational/OrderBuilder.ts` | Sequentially builds complex kids wear orders (with age group, sizes, delivery address, COD charges, and verification flags) ensuring integrity before instantiation. |
| **Creational** | **Singleton Pattern** | `src/infrastructure/database/DatabaseClient.ts` | Guarantees a single in-memory / cache data store instance across Next.js serverless requests. |
| **Structural** | **Facade Pattern** | `src/infrastructure/patterns/structural/CheckoutFacade.ts` | Simplifies the multi-step checkout workflow (pincode check -> COD eligibility -> payment execution -> order building -> persistence -> notifications) into one single call: `executeCheckout()`. |
| **Structural** | **Adapter Pattern** | `src/infrastructure/patterns/structural/PincodeServiceAdapter.ts` | Translates 3rd-party logistics carrier API responses (BlueDart/Delhivery/IndiaPost) into our clean internal `ServiceabilityResult` domain format. |
| **Structural** | **Repository Pattern** | `src/infrastructure/repositories/IProductRepository.ts`, `MockProductRepository.ts`, `IOrderRepository.ts` | Decouples business logic from the underlying storage mechanism (mock in-memory, Prisma, Supabase, or MongoDB). |
| **Behavioral** | **Strategy Pattern** | `src/infrastructure/patterns/behavioral/payment-strategies/IPaymentStrategy.ts`, `CashOnDeliveryStrategy.ts`, `OnlinePaymentStrategy.ts` | Encapsulates payment algorithms into interchangeable strategies. `CashOnDeliveryStrategy` enforces phone verification, max COD amount limits (₹5,000), and calculates COD handling fee. |
| **Behavioral** | **Observer Pattern** | `src/infrastructure/patterns/behavioral/events/OrderEventDispatcher.ts` | Publishes `ORDER_PLACED` events so subscribers can trigger SMS/WhatsApp OTP verification for COD orders without tightly coupling to checkout. |

---

### 3. Kids Wear & Cash on Delivery (COD) Domain Logic

#### Cash on Delivery (COD) Rules (`src/core/constants/CodRules.ts`):
- **Minimum Order Requirement**: ₹299 (Under ₹299, COD is disabled to protect delivery unit economics).
- **Maximum Order Requirement**: ₹5,000 (Orders above ₹5,000 require online prepayment to prevent return-to-origin / fake order losses).
- **COD Handling Fee**: ₹49 (Courier cash-handling surcharge).
- **Free COD Threshold**: Orders above ₹999 get **FREE COD & FREE Shipping**.
- **Phone Verification**: Mandatory 10-digit mobile number for dispatch confirmation call/SMS OTP.
- **Pincode Restriction**: Blocked zones adapter check.

#### Kids Wear Specifics:
- **Age Groups**: Infant (0-12M), Toddler (1-3Y), Little Kids (4-7Y), Big Kids (8-14Y).
- **Sizes**: `0-3M`, `3-6M`, `6-12M`, `1-2Y`, `2-3Y`, `3-4Y`, `4-5Y`, `5-6Y`.
- **Fabric Standards**: 100% GOTS Organic Cotton, Mulmul Muslin, Breathable Modal, Hypoallergenic & Nickel-free snaps.

---

### 4. Why Next.js on Vercel ("No Need to Render")

1. **Pre-rendering (SSG & ISR)**:
   - Product catalog, categories, and static landing pages are pre-rendered at build time.
   - Served directly from Vercel's global Edge CDN with sub-50ms TTFB.
   - No separate Express or Node.js server needs maintenance.
2. **Server Actions & Route Handlers**:
   - The COD Checkout Facade (`/api/orders`) and Pincode Verifier (`/api/pincode-check`) execute as lightweight Vercel Serverless Functions on-demand.
3. **Instant Zero-Config Deployment**:
   - Push to Git -> Connect to Vercel -> Automatic production build & SSL certificate.
