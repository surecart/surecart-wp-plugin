export function setResponses(args: Array<{ path: string; data: Object }>, page) {
  page.on('response', response => {
    if (response.url().includes('localhost')) {
      (page as any).removeAllListeners('request');
      page.on('request', request => {
        let data;
        args.forEach(arg => {
          if (request.url().includes(arg.path)) {
            data = arg.data;
          }
        });
        if (data) {
          return request.respond(data);
        } else {
          request.continue();
        }
      });
    }
  });
}
