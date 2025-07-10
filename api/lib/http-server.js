module.exports =(port,app)=>new Promise((resolve,reject)=>{
	var http = require('http')
	var server = http.createServer(app)

	server.listen(port)

	server.on('error', (err)=>{
		reject(err)
	})

	server.on('listening', ()=>{
		eventLog('[httpServer]'.cyan,'listening on port',port)
		resolve(server)
	})

})
