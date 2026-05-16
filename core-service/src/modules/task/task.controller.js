const svc      = require('./task.service');
const response = require('../../shared/utils/response');

const createTask       = async (req, res, next) => { try { return response.created(res, await svc.createTask(req.user, req.body)); } catch (e) { next(e); } };
const getTasksByProject= async (req, res, next) => { try { return response.ok(res, await svc.getTasksByProject(req.user, req.query.projectId, req.query)); } catch (e) { next(e); } };
const getTaskById      = async (req, res, next) => { try { return response.ok(res, await svc.getTaskById(req.user, req.params.id)); } catch (e) { next(e); } };
const getSubTasks      = async (req, res, next) => { try { return response.ok(res, await svc.getSubTasks(req.user, req.params.id)); } catch (e) { next(e); } };
const updateTask       = async (req, res, next) => { try { return response.ok(res, await svc.updateTask(req.user, req.params.id, req.body), 'Task updated'); } catch (e) { next(e); } };
const changeStatus     = async (req, res, next) => { try { return response.ok(res, await svc.changeStatus(req.user, req.params.id, req.body.status), 'Status updated'); } catch (e) { next(e); } };
const assignTask       = async (req, res, next) => { try { return response.ok(res, await svc.assignTask(req.user, req.params.id, req.body.assigneeId), 'Task assigned'); } catch (e) { next(e); } };
const deleteTask       = async (req, res, next) => { try { await svc.deleteTask(req.user, req.params.id); return response.ok(res, null, 'Task deleted'); } catch (e) { next(e); } };
const logTime          = async (req, res, next) => { try { return response.ok(res, await svc.logTime(req.user, req.params.id, req.body), 'Time logged'); } catch (e) { next(e); } };

module.exports = { createTask, getTasksByProject, getTaskById, getSubTasks, updateTask, changeStatus, assignTask, deleteTask, logTime };
