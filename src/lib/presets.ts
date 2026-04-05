export interface Preset {
  name: string
  html: string
}

export const PRESETS: Preset[] = [
  {
    name: 'Card',
    html: `<div class="card" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;max-width:320px;">
  <img src="https://example.com/photo.jpg" alt="Card image" style="width:100%;height:180px;object-fit:cover;" />
  <div style="padding:16px;">
    <h3>Card Title</h3>
    <p>This is a short description of the card content. It can span multiple lines.</p>
    <div style="display:flex;gap:8px;margin-top:12px;">
      <button>Action</button>
      <button>Cancel</button>
    </div>
  </div>
</div>`,
  },
  {
    name: 'Profile Header',
    html: `<div style="display:flex;align-items:center;gap:16px;padding:16px;">
  <img src="https://example.com/avatar.jpg" alt="Avatar" style="width:64px;height:64px;border-radius:50%;" />
  <div>
    <h2>John Doe</h2>
    <p>Software Engineer at Acme Corp</p>
    <span>San Francisco, CA</span>
  </div>
</div>`,
  },
  {
    name: 'Table Row',
    html: `<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #e2e8f0;">
  <img src="https://example.com/thumb.jpg" alt="" style="width:40px;height:40px;border-radius:4px;" />
  <div style="flex:1;">
    <span>Item name goes here</span>
    <p>Category</p>
  </div>
  <span>$99.00</span>
  <button>Buy</button>
</div>`,
  },
  {
    name: 'Article',
    html: `<article style="max-width:640px;">
  <img src="https://example.com/hero.jpg" alt="Article hero" style="width:100%;height:240px;object-fit:cover;border-radius:8px;" />
  <div style="padding:16px 0;">
    <h1>Article Headline That Spans One or Two Lines</h1>
    <p>Author Name · April 5, 2026</p>
    <p>The opening paragraph of the article that provides context and draws the reader in. This is usually two or three sentences long.</p>
    <p>A second paragraph with more detail about the topic. It continues to develop the theme introduced in the opening.</p>
  </div>
</article>`,
  },
  {
    name: 'Dashboard',
    html: `<div style="display:grid;gap:16px;">
  <div style="display:flex;gap:16px;">
    <div style="flex:1;padding:16px;border:1px solid #e2e8f0;border-radius:8px;">
      <h4>Total Revenue</h4>
      <h2>$48,295</h2>
      <span>+12.5% this month</span>
    </div>
    <div style="flex:1;padding:16px;border:1px solid #e2e8f0;border-radius:8px;">
      <h4>Active Users</h4>
      <h2>3,842</h2>
      <span>+5.2% this month</span>
    </div>
  </div>
  <div style="padding:16px;border:1px solid #e2e8f0;border-radius:8px;">
    <h3>Recent Activity</h3>
    <ul>
      <li>User signed up</li>
      <li>Payment received</li>
      <li>New order placed</li>
      <li>Support ticket opened</li>
    </ul>
  </div>
</div>`,
  },
]
