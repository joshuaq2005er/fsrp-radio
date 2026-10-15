import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import crypto from 'node:crypto';
import 'dotenv/config';

const app=express();const server=http.createServer(app);
const io=new Server(server,{maxHttpBufferSize:100000});
app.disable('x-powered-by');app.use(express.static('public'));
const names={LEO:['LEO DISPATCH 1','LEO TAC 1','LEO TAC 2','LEO SUPERVISORS'],TFD:['FIRE DISPATCH','FIREGROUND 1','FIREGROUND 2','FIRE COMMAND'],EMS:['EMS DISPATCH','MEDICAL TAC','HOSPITAL CONTACT','EMS COMMAND'],DOT:['DOT DISPATCH','TRAFFIC OPERATIONS','INCIDENT RESPONSE','DOT SUPERVISORS']};
const secrets=Object.fromEntries(Object.keys(names).map(k=>[k,process.env[`PASSCODE_${k}`]]));
for(const [k,v] of Object.entries(secrets))if(!v||v.length<12)throw Error(`Set PASSCODE_${k} to a unique 12+ character secret in .env`);
const users=new Map(),owners=new Map(),talkers=new Map(),attempts=new Map();
const room=(d,c)=>`${d}:${c}`;const safe=(s)=>typeof s==='string'?s:'';
function same(a,b){const x=crypto.createHash('sha256').update(a).digest(),y=crypto.createHash('sha256').update(b).digest();return crypto.timingSafeEqual(x,y)}
function roster(r){return [...users.entries()].filter(([id,u])=>room(u.dept,u.channel)===r).map(([id,u])=>({id,callsign:u.callsign,talking:talkers.get(r)===id}))}
function broadcast(r){io.to(r).emit('roster',roster(r));io.to(r).emit('speaker',talkers.get(r)||null)}
function release(socket){const u=users.get(socket.id);if(!u)return;const r=room(u.dept,u.channel);if(talkers.get(r)===socket.id)talkers.delete(r);socket.leave(r);broadcast(r)}
function logout(socket){const u=users.get(socket.id);if(!u)return;release(socket);owners.delete(`${u.dept}:${u.callsign}`);users.delete(socket.id)}
io.on('connection',socket=>{
 socket.on('login',(data,ack)=>{if(typeof ack!=='function')return;const ip=socket.handshake.address, t=Date.now(),a=(attempts.get(ip)||[]).filter(x=>t-x<60000);if(a.length>=8)return ack({ok:false,error:'Too many attempts. Try again in one minute.'});a.push(t);attempts.set(ip,a);
 const dept=safe(data?.dept),callsign=safe(data?.callsign).trim().toUpperCase(),pass=safe(data?.passcode);
 if(!names[dept]||!/^[A-Z0-9 -]{2,18}$/.test(callsign)||!same(pass,secrets[dept]))return ack({ok:false,error:'Invalid department, callsign or passcode.'});
 if(owners.has(`${dept}:${callsign}`))return ack({ok:false,error:'This callsign is already online.'});
 logout(socket);const u={dept,callsign,channel:0};users.set(socket.id,u);owners.set(`${dept}:${callsign}`,socket.id);socket.join(room(dept,0));ack({ok:true,dept,callsign,channels:names[dept],id:socket.id});broadcast(room(dept,0));io.to(room(dept,0)).emit('activity',`${callsign} joined the channel`);
 });
 socket.on('switch-channel',(c,ack)=>{const u=users.get(socket.id);if(!u||!Number.isInteger(c)||c<0||c>=names[u.dept].length)return ack?.({ok:false});release(socket);u.channel=c;socket.join(room(u.dept,c));ack?.({ok:true});broadcast(room(u.dept,c));io.to(room(u.dept,c)).emit('activity',`${u.callsign} joined ${names[u.dept][c]}`)});
 socket.on('ptt-start',ack=>{const u=users.get(socket.id);if(!u)return ack?.({ok:false,error:'Not signed in'});const r=room(u.dept,u.channel);if(talkers.has(r)&&talkers.get(r)!==socket.id)return ack?.({ok:false,error:'Channel busy'});talkers.set(r,socket.id);broadcast(r);ack?.({ok:true})});
 socket.on('ptt-stop',()=>{const u=users.get(socket.id);if(!u)return;const r=room(u.dept,u.channel);if(talkers.get(r)===socket.id){talkers.delete(r);broadcast(r)}});
 socket.on('signal',({to,description,candidate})=>{const a=users.get(socket.id),b=users.get(to);if(!a||!b||a.dept!==b.dept||a.channel!==b.channel)return;if(description&&JSON.stringify(description).length>12000)return;if(candidate&&JSON.stringify(candidate).length>4000)return;io.to(to).emit('signal',{from:socket.id,description,candidate})});
 socket.on('panic',()=>{const u=users.get(socket.id);if(u)io.to(room(u.dept,u.channel)).emit('panic',{callsign:u.callsign,channel:names[u.dept][u.channel]})});
 socket.on('logout',()=>logout(socket));socket.on('disconnect',()=>logout(socket));
});
server.listen(Number(process.env.PORT)||3000,()=>console.log('Clearwater RTO listening'));
