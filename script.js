var w = window.innerWidth,
            h = window.innerHeight,
            canvas = document.getElementById('test'),
            ctx = canvas.getContext('2d'),
            rate = 60,
            arc = 80, // 20% menos de 100
            time,
            count,
            size = 7,
            speed = 10, // Reducción de la velocidad
            parts = new Array,
            colors = ['#a0304f', '#8d1638', '#7b0323', '#5b011b', '#3d0112'];
        var mouse = { x: 0, y: 0 };

        canvas.setAttribute('width', w);
        canvas.setAttribute('height', h);

        function create() {
            time = 0;
            count = 0;

            for (var i = 0; i < arc; i++) {
                parts[i] = {
                    x: Math.ceil(Math.random() * w),
                    y: Math.ceil(Math.random() * h),
                    toX: Math.random() * 5 - 1,
                    toY: Math.random() * 2 - 1,
                    c: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * size
                }
            }
        }

        function particles() {
            ctx.clearRect(0, 0, w, h);
            canvas.addEventListener('mousemove', MouseMove, false);
            for (var i = 0; i < arc; i++) {
                var li = parts[i];
                var distanceFactor = DistanceBetween(mouse, parts[i]);
                var distanceFactor = Math.max(Math.min(15 - (distanceFactor / 10), 10), 1);
                ctx.beginPath();
                ctx.arc(li.x, li.y, li.size * distanceFactor, 0, Math.PI * 2, false);
                ctx.fillStyle = li.c;
                ctx.strokeStyle = li.c;
                if (i % 2 == 0)
                    ctx.stroke();
                else
                    ctx.fill();

                li.x = li.x + li.toX * (time * 0.03); // Reducir la velocidad
                li.y = li.y + li.toY * (time * 0.03);

                if (li.x > w) {
                    li.x = 0;
                }
                if (li.y > h) {
                    li.y = 0;
                }
                if (li.x < 0) {
                    li.x = w;
                }
                if (li.y < 0) {
                    li.y = h;
                }
            }
            if (time < speed) {
                time++;
            }
            setTimeout(particles, 1000 / rate);
        }

        function MouseMove(e) {
            mouse.x = e.layerX;
            mouse.y = e.layerY;
        }

        function DistanceBetween(p1, p2) {
            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        create();
        particles();
        
        function adjustCanvasSize() {
            const canvases = document.querySelectorAll('.circle');
            canvases.forEach(canvas => {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            });
        }
        
        window.addEventListener('resize', adjustCanvasSize);
        adjustCanvasSize();
        const countDownClock = (number = 100, format = 'seconds') => {
            const d = document;
            const daysElement = d.querySelector('.days');
            const hoursElement = d.querySelector('.hours');
            const minutesElement = d.querySelector('.minutes');
            const secondsElement = d.querySelector('.seconds');
            const daysCircle = d.querySelector('#days-circle');
            const hoursCircle = d.querySelector('#hours-circle');
            const minutesCircle = d.querySelector('#minutes-circle');
            const secondsCircle = d.querySelector('#seconds-circle');
        
            let countdown;
            convertFormat(format);
            
            function convertFormat(format) {
              switch(format) {
                case 'seconds':
                  return timer(number);
                case 'minutes':
                  return timer(number * 60);
                case 'hours':
                  return timer(number * 60 * 60);
                case 'days':
                  return timer(number * 60 * 60 * 24);             
              }
            }
        
            function timer(seconds) {
              const now = Date.now();
              const then = now + seconds * 1000;
        
              countdown = setInterval(() => {
                const secondsLeft = Math.round((then - Date.now()) / 1000);
        
                if(secondsLeft <= 0) {
                  clearInterval(countdown);
                  return;
                };
        
                displayTimeLeft(secondsLeft);
        
              },1000);
            }
        
            function drawCircle(canvas, percentage, color) {
                const ctx = canvas.getContext('2d');
                const radius = canvas.width / 2;
                const offset = radius * 0.2;
                const endAngle = (percentage / 100) * 2 * Math.PI;
                
                // Determina el grosor del trazo en función del tamaño de la ventana
                const lineWidth = window.innerWidth <= 800 ? 6 : 10;
                const dotWidth = window.innerWidth <= 800 ? 6 : 10;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Dibuja el trazo del círculo
                ctx.beginPath();
                ctx.arc(radius, radius, radius - offset, -Math.PI / 2, endAngle - Math.PI / 2);
                ctx.lineWidth = lineWidth;  // Usa el grosor del trazo determinado
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.closePath();
                
                // Dibuja el círculo en la punta del trazo
                const endX = radius + (radius - offset) * Math.cos(endAngle - Math.PI / 2);
                const endY = radius + (radius - offset) * Math.sin(endAngle - Math.PI / 2);
                
                ctx.beginPath();
                ctx.arc(endX, endY, dotWidth, 0, 2 * Math.PI); 
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
            }
            

            function displayTimeLeft(seconds) {
                const totalSeconds = {
                    days: Math.floor(seconds / 86400),
                    hours: Math.floor((seconds % 86400) / 3600),
                    minutes: Math.floor((seconds % 86400) % 3600 / 60),
                    seconds: seconds % 60
                };
            
                daysElement.textContent = totalSeconds.days;
                hoursElement.textContent = totalSeconds.hours;
                minutesElement.textContent = totalSeconds.minutes;
                secondsElement.textContent = totalSeconds.seconds < 10 ? `0${totalSeconds.seconds}` : totalSeconds.seconds;
            
                // Llama a drawCircle con diferentes colores
                drawCircle(daysCircle, (totalSeconds.days / 100) * 100, '#3d0112'); 
                drawCircle(hoursCircle, (totalSeconds.hours / 24) * 100, '#5b011b'); 
                drawCircle(minutesCircle, (totalSeconds.minutes / 60) * 100, '#7b0323');
                drawCircle(secondsCircle, (totalSeconds.seconds / 60) * 100, '#8d1638');
            }
        }
        
        countDownClock(287, 'days');
