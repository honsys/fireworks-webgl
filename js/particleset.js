var ParticleSet = function(gl, type, force, color) {
	this._gl = gl;
	this._buffers = {
		velocity: gl.createBuffer()
	}
	
	this._color = color;
	this._build(type, force);
}

ParticleSet.prototype.destroy = function() {
	for (var p in this._buffers) {
		this._gl.deleteBuffer(this._buffers[p]);
	}
	this._buffers = {};
}

ParticleSet.prototype._build = function(type, force) {
	var gl = this._gl;
	var buffers = this._buffers;
	this._count = (type == "sphere" ? 1000 : 200);
	
	var tmp3 = vec3.create();
	var tmp2 = vec2.create();
	var velocity = [];
	
	for (var i=0;i<this._count;i++) {
		if (type == "sphere") {
			vec3.random(tmp3, force);
		} else {
			vec2.random(tmp2, force);
			vec2.copy(tmp3, tmp2);
			tmp3[2] = 0;
		}
		velocity.push(tmp3[0], tmp3[1], tmp3[2]);
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(velocity), gl.STATIC_DRAW);
}

ParticleSet.prototype.render = function(program) {
	var gl = this._gl;
	var a = program.attributes;
	var u = program.uniforms;
	var buffers = this._buffers;

	gl.uniform3fv(u.uColor, this._color);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
	gl.vertexAttribPointer(a.aVelocity, 3, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.POINTS, 0, this._count);
}
