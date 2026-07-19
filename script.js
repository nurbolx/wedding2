(function () {
  'use strict';

  // ---- Edit these for your own event ----
  var EVENT_DATE = new Date(2027, 1, 23, 18, 0); // February 23, 2027, 18:00
  var WEEKDAYS = ['дс', 'сс', 'ср', 'бс', 'жм', 'сн', 'жс'];
  var MONTHS_NOM = ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'];
  var PROGRAM = [
    { time: '17:00', label: 'Қонақтарды қарсы алу', icon: 'guests' },
    { time: '18:00', label: 'Беташар рәсімі', icon: 'veil' },
    { time: '19:00', label: 'Құдаларды қарсы алу', icon: 'rings' },
    { time: '20:00', label: 'Той салтанаты', icon: 'ribbon' },
    { time: '22:00', label: 'Тойдың торты', icon: 'cake' }
  ];

  var HEART_SVG = '<svg viewBox="0 0 32 28" width="20" height="17.5" aria-hidden="true"><path d="M16 26 C 4 19, 1 11, 6 6 C 11 1, 16 6, 16 9 C 16 6, 21 1, 26 6 C 31 11, 28 19, 16 26 Z"></path></svg>';

  var ICONS = {
    guests: '<circle cx="9" cy="8" r="2.8"></circle><path d="M4 20a5 5 0 0 1 10 0"></path><circle cx="16.5" cy="9.2" r="2"></circle><path d="M15 20a4.2 4.2 0 0 1 6-3.8"></path>',
    veil: '<circle cx="12" cy="8" r="3.2"></circle><path d="M7 8.5C5.2 12.5 5.8 18 8 21"></path><path d="M17 8.5c1.8 4 1.2 9.5-1 12.5"></path><path d="M9 21h6"></path>',
    rings: '<circle cx="9" cy="13" r="4.6"></circle><circle cx="15" cy="11" r="4.6"></circle>',
    ribbon: '<path d="M8.2 3.5l1.4 6.4c.3 1.4-.7 2.6-2.1 2.6s-2.4-1.2-2.1-2.6L6.8 3.5z"></path><path d="M7.5 12.5L6.8 21"></path><path d="M4.5 21h5"></path><path d="M15.8 3.5l-1.4 6.4c-.3 1.4.7 2.6 2.1 2.6s2.4-1.2 2.1-2.6L17.2 3.5z"></path><path d="M16.5 12.5L17.2 21"></path><path d="M14.5 21h5"></path>',
    cake: '<path d="M5 21v-7.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2V21"></path><path d="M5 16.5h14"></path><path d="M12 11.5V8"></path><circle cx="12" cy="5.6" r="1.1"></circle><path d="M3.5 21h17"></path>'
  };

  function pad2(n) { return String(n).padStart(2, '0'); }

  // ---- Hero / invitation date labels ----
  function renderDates() {
    var dd = pad2(EVENT_DATE.getDate());
    var mm = pad2(EVENT_DATE.getMonth() + 1);
    var yyyy = EVENT_DATE.getFullYear();
    var heroDate = document.getElementById('heroDate');
    if (heroDate) heroDate.textContent = dd + ' . ' + mm + ' . ' + yyyy;

    var inviteDate = document.getElementById('inviteDate');
    if (inviteDate) inviteDate.textContent = EVENT_DATE.getDate() + ' ' + MONTHS_NOM[EVENT_DATE.getMonth()] + ' ' + yyyy;

    var inviteTime = document.getElementById('inviteTime');
    if (inviteTime) inviteTime.textContent = pad2(EVENT_DATE.getHours()) + ':' + pad2(EVENT_DATE.getMinutes());
  }

  // ---- Calendar grid for the event's month ----
  function renderCalendar() {
    var el = document.getElementById('calendar');
    if (!el) return;
    var y = EVENT_DATE.getFullYear(), mo = EVENT_DATE.getMonth(), eventDay = EVENT_DATE.getDate();
    var daysInMonth = new Date(y, mo + 1, 0).getDate();
    var offset = (new Date(y, mo, 1).getDay() + 6) % 7; // Monday-first

    var html = '';
    for (var w = 0; w < WEEKDAYS.length; w++) {
      html += '<div class="cal-wd">' + WEEKDAYS[w] + '</div>';
    }
    for (var i = 0; i < offset; i++) html += '<div class="cal-day"></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      if (d === eventDay) {
        html += '<div class="cal-day is-event"><span class="cal-event-wrap">' +
          '<svg viewBox="0 0 36 32" width="36" height="32" aria-hidden="true"><path d="M18 30 C 4 22, 2 12, 8 7 C 13 3, 18 8, 18 11 C 18 8, 23 3, 28 7 C 34 12, 32 22, 18 30 Z"></path></svg>' +
          '<span>' + d + '</span></span></div>';
      } else {
        html += '<div class="cal-day">' + d + '</div>';
      }
    }
    el.innerHTML = html;
  }

  // ---- Countdown timer ----
  function tickCountdown() {
    var now = new Date();
    var diff = Math.max(0, Math.floor((EVENT_DATE.getTime() - now.getTime()) / 1000));
    var days = Math.floor(diff / 86400);
    var hours = Math.floor((diff % 86400) / 3600);
    var minutes = Math.floor((diff % 3600) / 60);
    var seconds = diff % 60;
    var map = { cdDays: days, cdHours: hours, cdMinutes: minutes, cdSeconds: seconds };
    Object.keys(map).forEach(function (id) {
      var e = document.getElementById(id);
      if (e) e.textContent = pad2(map[id]);
    });
  }

  // ---- Program / timing rows ----
  function renderProgram() {
    var wrap = document.getElementById('timingRows');
    if (!wrap) return;
    var html = '';
    PROGRAM.forEach(function (row) {
      html += '' +
        '<div class="timing-row">' +
        '<div class="timing-icon"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[row.icon] + '</svg></div>' +
        '<div class="timing-mid"><span class="line"></span><span class="heart">' + HEART_SVG + '</span></div>' +
        '<div><div class="timing-time">' + row.time + '</div><div class="timing-label">' + row.label + '</div></div>' +
        '</div>';
    });
    wrap.innerHTML = html;
  }

  // ---- RSVP form ----
  function setupRsvp() {
    var form = document.getElementById('rsvpForm');
    var noteWrap = document.getElementById('noteWrap');
    var successMsg = document.getElementById('successMsg');
    if (!form) return;

    form.addEventListener('change', function (e) {
      if (e.target && e.target.name === 'attendance') {
        var attending = e.target.value !== 'no';
        if (noteWrap) noteWrap.style.display = attending ? '' : 'none';
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {
        name: (document.getElementById('rName') || {}).value || '',
        attendance: (form.querySelector('input[name="attendance"]:checked') || {}).value || '',
        note: (document.getElementById('rNote') || {}).value || '',
        savedAt: new Date().toISOString()
      };
      try {
        var list = JSON.parse(localStorage.getItem('rsvpResponses') || '[]');
        list.push(data);
        localStorage.setItem('rsvpResponses', JSON.stringify(list));
      } catch (err) { /* localStorage unavailable — ignore */ }

      form.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
    });
  }

  // ---- Wishes button: reveal + focus the note field on the RSVP form ----
  function setupWishesButton() {
    var btn = document.getElementById('wishesBtn');
    var noteWrap = document.getElementById('noteWrap');
    var note = document.getElementById('rNote');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (noteWrap) noteWrap.style.display = '';
      var rsvpWrap = document.querySelector('.rsvp-wrap');
      if (rsvpWrap) rsvpWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (note) setTimeout(function () { note.focus(); }, 400);
    });
  }

  // ---- Background music toggle ----
  function setupMusic() {
    var btn = document.getElementById('musicBtn');
    var audio = document.getElementById('audioEl');
    if (!btn || !audio || !audio.currentSrc && !audio.src) return;
    btn.addEventListener('click', function () {
      if (audio.paused) audio.play(); else audio.pause();
    });
    audio.addEventListener('play', function () { btn.classList.add('is-playing'); });
    audio.addEventListener('pause', function () { btn.classList.remove('is-playing'); });
  }

  function init() {
    renderDates();
    renderCalendar();
    renderProgram();
    tickCountdown();
    setInterval(tickCountdown, 1000);
    setupRsvp();
    setupWishesButton();
    setupMusic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
