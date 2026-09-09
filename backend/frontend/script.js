
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const toast = document.getElementById("toast");
const backTop = document.getElementById("backTop");

menuToggle?.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

document.querySelectorAll("#mobileNav a").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

document.getElementById("searchForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const location = document.getElementById("location").value.trim();

  if(location){
    showToast(`Searching verified physiotherapists near ${location}...`);
    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({behavior:"smooth"});
    }, 500);
  }
});

document.querySelectorAll(".service-pills button").forEach(button => {
  button.addEventListener("click", () => {
    const service = button.dataset.service;
    document.getElementById("location").focus();
    showToast(`${service} selected — enter your city or area.`);
  });
});

document.getElementById("bookingForm")?.addEventListener("submit", e => {
  e.preventDefault();
  showToast("Thank you! Your booking request has been received.");
  e.target.reset();
});

window.addEventListener("scroll", () => {
  if(window.scrollY > 500) backTop.classList.add("show");
  else backTop.classList.remove("show");
});

backTop.addEventListener("click", () => {
  window.scrollTo({top:0, behavior:"smooth"});
});
