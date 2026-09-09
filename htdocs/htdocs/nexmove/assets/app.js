(function () {
    const form = document.getElementById('bookingForm');
    const pain = document.getElementById('painRange');
    const painValue = document.getElementById('painValue');
    const preferredDate = document.getElementById('preferredDate');

    if (preferredDate) {
        const today = new Date();
        const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 10);
        preferredDate.min = local;
    }

    if (pain && painValue) {
        pain.addEventListener('input', () => painValue.textContent = pain.value);
    }

    document.querySelectorAll('.service-card input[type="radio"]').forEach(input => {
        input.addEventListener('change', function () {
            document.querySelectorAll('.service-card').forEach(card => card.classList.remove('selected'));
            this.closest('.service-card')?.classList.add('selected');

            const name = this.dataset.name || '';
            const duration = this.dataset.duration || '';
            const type = this.dataset.type || '';
            const price = parseFloat(this.dataset.price || '0');

            const sumService = document.getElementById('sumService');
            const sumDuration = document.getElementById('sumDuration');
            const sumType = document.getElementById('sumType');
            const sumPrice = document.getElementById('sumPrice');
            if (sumService) sumService.textContent = name;
            if (sumDuration) sumDuration.textContent = duration;
            if (sumType) sumType.textContent = type;
            if (sumPrice) sumPrice.textContent = Number.isInteger(price) ? String(price) : price.toFixed(2);
        });
    });

    document.querySelectorAll('.time-card input[type="radio"]').forEach(input => {
        input.addEventListener('change', function () {
            document.querySelectorAll('.time-card').forEach(card => card.classList.remove('selected'));
            this.closest('.time-card')?.classList.add('selected');
        });
    });

    document.querySelectorAll('.condition-chip input[type="radio"]').forEach(input => {
        input.addEventListener('change', function () {
            document.querySelectorAll('.condition-chip').forEach(chip => chip.classList.remove('selected'));
            this.closest('.condition-chip')?.classList.add('selected');
        });
    });

    const findAddress = document.getElementById('findAddress');
    const addressHint = document.getElementById('addressHint');
    if (findAddress) {
        findAddress.addEventListener('click', function () {
            const postcode = form?.querySelector('[name="postcode"]')?.value.trim();
            if (addressHint) {
                addressHint.textContent = postcode
                    ? 'Postcode entered. Please type your address and city/town below.'
                    : 'Please enter your postcode first.';
            }
        });
    }
})();
