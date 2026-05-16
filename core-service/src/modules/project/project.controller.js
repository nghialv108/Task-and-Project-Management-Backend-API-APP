const svc      = require('./project.service');
const response = require('../../shared/utils/response');

const createProject   = async (req, res, next) => { try { return response.created(res, await svc.createProject(req.user, req.body)); } catch (e) { next(e); } };
const getProjects     = async (req, res, next) => { try { return response.ok(res, await svc.getProjects(req.user)); } catch (e) { next(e); } };
const getProjectById  = async (req, res, next) => { try { return response.ok(res, await svc.getProjectById(req.user, req.params.id)); } catch (e) { next(e); } };
const updateProject   = async (req, res, next) => { try { return response.ok(res, await svc.updateProject(req.user, req.params.id, req.body), 'Project updated'); } catch (e) { next(e); } };
const deleteProject   = async (req, res, next) => { try { await svc.deleteProject(req.user, req.params.id); return response.ok(res, null, 'Project deleted'); } catch (e) { next(e); } };
const addMember       = async (req, res, next) => { try { return response.ok(res, await svc.addMember(req.user, req.params.id, req.body.userId), 'Member added'); } catch (e) { next(e); } };
const removeMember    = async (req, res, next) => { try { await svc.removeMember(req.user, req.params.id, req.params.memberId); return response.ok(res, null, 'Member removed'); } catch (e) { next(e); } };
const addMilestone    = async (req, res, next) => { try { return response.ok(res, await svc.addMilestone(req.user, req.params.id, req.body), 'Milestone added'); } catch (e) { next(e); } };
const updateMilestone = async (req, res, next) => { try { return response.ok(res, await svc.updateMilestone(req.user, req.params.id, req.params.mid, req.body), 'Milestone updated'); } catch (e) { next(e); } };

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, addMember, removeMember, addMilestone, updateMilestone };
