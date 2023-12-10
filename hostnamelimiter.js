const requestCount = new Map

function scheduleAtMidNight() {
   const now = new Date();
   const midNight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,  // Hour MidNight in 24-hour format (0-23)
      0,  // Minute
      0,  // Second
      0   // Millisecond
   );

   let delay = midNight.getTime() - now.getTime();
   if (delay < 0) {
      // If 2 o'clock has already passed today, schedule for 2 o'clock tomorrow
      delay += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
   }

   setTimeout(() => {
      requestCount.clear();// clear Map
      // Reschedule for midNight tomorrow
      scheduleAtMidNight();
   }, delay);
}

scheduleAtMidNight()

export function logRequestCount(_req,info,next){
   const LIMIT = 24;
   const { _transport, hostname, _port } = info.remoteAddr;
   const count = (requestCount.get(hostname)??0)+1;
   if(count > LIMIT) return new Response('you have reached the limit of 24 access per day')
   requestCount.set(hostname, count);
   return next();
}