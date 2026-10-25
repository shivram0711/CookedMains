BEGIN;

-- 1. USERS
INSERT INTO users (id, email, name, avatar, free_credits, is_pro, free_rewrites, target_year, optional_subject, plan_tier, is_admin, password_hash, created_at)
VALUES ('usr_shivram_001', 'shivram@gmail.com', 'Shiv', 'https://api.dicebear.com/7.x/bottts/svg?seed=shivram@gmail.com', 15, 1, 5, '2026', 'PSIR', 'starter', 0, NULL, '2026-10-15 14:29:29')
ON CONFLICT (id) DO UPDATE SET free_credits = EXCLUDED.free_credits, is_pro = EXCLUDED.is_pro;

INSERT INTO users (id, email, name, avatar, free_credits, is_pro, free_rewrites, target_year, optional_subject, plan_tier, is_admin, password_hash, created_at)
VALUES ('usr_pranav_002', 'pranavsaxena301@gmail.com', 'Pranav Saxena', 'https://api.dicebear.com/7.x/bottts/svg?seed=pranavsaxena301@gmail.com', 15, 1, 5, '2026', 'Geography', 'starter', 0, NULL, '2026-10-25 08:30:00')
ON CONFLICT (id) DO UPDATE SET free_credits = EXCLUDED.free_credits, is_pro = EXCLUDED.is_pro;

INSERT INTO users (id, email, name, avatar, free_credits, is_pro, free_rewrites, target_year, optional_subject, plan_tier, is_admin, password_hash, created_at)
VALUES ('usr_bablu_003', 'bhaib7852@gmail.com', 'Bablu Bhai Bhai', 'https://api.dicebear.com/7.x/bottts/svg?seed=bhaib7852@gmail.com', 15, 1, 5, '2026', 'Sociology', 'starter', 0, NULL, '2026-10-25 08:45:00')
ON CONFLICT (id) DO UPDATE SET free_credits = EXCLUDED.free_credits, is_pro = EXCLUDED.is_pro;

INSERT INTO users (id, email, name, avatar, free_credits, is_pro, free_rewrites, target_year, optional_subject, plan_tier, is_admin, password_hash, created_at)
VALUES ('usr_shivram0711_004', 'shivram0711@gmail.com', 'Shivram0711', 'https://api.dicebear.com/7.x/bottts/svg?seed=shivram0711@gmail.com', 15, 1, 5, '2026', 'History', 'mains_pro', 0, NULL, '2026-10-25 09:00:00')
ON CONFLICT (id) DO UPDATE SET free_credits = EXCLUDED.free_credits, is_pro = EXCLUDED.is_pro;

INSERT INTO users (id, email, name, avatar, free_credits, is_pro, free_rewrites, target_year, optional_subject, plan_tier, is_admin, password_hash, created_at)
VALUES ('usr_guest_005', 'guest@cookedmains.in', 'Guest Aspirant', 'https://api.dicebear.com/7.x/bottts/svg?seed=guest@cookedmains.in', 15, 1, 5, '2026', 'PSIR', 'starter', 0, NULL, '2026-10-17 11:36:49')
ON CONFLICT (id) DO UPDATE SET free_credits = EXCLUDED.free_credits, is_pro = EXCLUDED.is_pro;

-- 2. ACTIVITY LOGS
INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_923efacc7392', 'shivram@gmail.com', 'Shiv', 'session_active', 'Shiv (shivram@gmail.com) is online', 'Active on screen: Intake Deck (GS3 • 15M)', NULL, '2026-10-15 19:59:34')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_5ad8e14b2b4b', 'shivram@gmail.com', 'Shiv', 'copy_evaluated', 'Evaluated GS1 (15M) — Scored 6.5/15', 'Q: The British victory in the Battle of Plassey in 1757 not just changed the course of I', 'eval_1792074642_224d41', '2026-10-15 20:00:42')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_120c80b4019a', 'shivram@gmail.com', 'Shiv', 'session_active', 'Shiv (shivram@gmail.com) is online', 'Active on screen: Landing Page', NULL, '2026-10-15 20:39:36')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_4908e607b07b', 'shivram@gmail.com', 'Shiv', 'copy_evaluated', 'Evaluated GS4 (10M) — Scored 4.5/10', 'Q: किसी व्यक्ति के दृष्टिकोण के घटकों पर चर्चा कीजिये तथा प्रेरक संचार एवं सामाजिक प्रभा', 'eval_1792077017_5a1a80', '2026-10-15 20:40:17')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_1886785f2c92', 'guest@cookedmains.in', 'Guest', 'copy_evaluated', 'Evaluated Essay Paper (125M) — Scored 25.0/125', 'Topic: Courage is resistance to fear, mastery of fear, not absence of fear.', 'eval_1792237009_a055c2', '2026-10-17 17:06:49')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_d058dc34882a', 'guest@cookedmains.in', 'Guest', 'copy_evaluated', 'Evaluated Essay Paper (125M) — Scored 25.0/125', 'Topic: Courage is resistance to fear, mastery of fear, not absence of fear.', 'eval_1792237058_d2a573', '2026-10-17 17:07:38')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_7097ff3da22d', 'guest@cookedmains.in', 'Guest', 'copy_evaluated', 'Evaluated Essay Paper (125M) — Scored 25.0/125', 'Topic: Courage is resistance to fear, mastery of fear, not absence of fear.', 'eval_1792237107_48cc05', '2026-10-17 17:08:27')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_91ecdffec7ed', 'guest@cookedmains.in', 'Guest', 'copy_evaluated', 'Evaluated Essay Paper (125M) — Scored 55.0/125', 'Topic: Courage is resistance to fear, mastery of fear, not absence of fear.', 'eval_1792243266_f98665', '2026-10-17 18:51:06')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_23973e17816c', 'guest@cookedmains.in', 'Guest', 'copy_evaluated', 'Evaluated Essay Paper (125M) — Scored 25.0/125', 'Topic: Courage is resistance to fear, mastery of fear, not absence of fear.', 'eval_1792243539_0fd39e', '2026-10-17 18:55:39')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_d957b4444d0e', 'guest@cookedmains.in', 'Guest', 'copy_evaluated', 'Evaluated Essay Paper (125M) — Scored 55.0/125', 'Topic: Courage is resistance to fear, mastery of fear, not absence of fear.', 'eval_1792244067_00498f', '2026-10-17 19:04:27')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_575eba204bf9', 'guest@cookedmains.in', 'Guest', 'copy_evaluated', 'Evaluated Essay Paper (125M) — Scored 55.0/125', 'Topic: Courage is resistance to fear, mastery of fear, not absence of fear.', 'eval_1792260406_2f6705', '2026-10-17 23:36:46')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_7d287f723cf9', 'guest@cookedmains.in', 'Guest', 'copy_evaluated', 'Evaluated Essay Paper (125M) — Scored 55.0/125', 'Topic: Courage is resistance to fear, mastery of fear, not absence of fear.', 'eval_1792303925_4b37df', '2026-10-18 11:42:05')
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES ('act_e070f8f57933', 'guest@cookedmains.in', 'Guest', 'copy_evaluated', 'Evaluated Essay Paper (125M) — Scored 55.0/125', 'Topic: Courage is resistance to fear, mastery of fear, not absence of fear.', 'eval_1792486329_f31f59', '2026-10-20 14:22:09')
ON CONFLICT (id) DO NOTHING;

-- 3. USER SESSIONS
INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_esfwgqy7w_muzpf41f', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 21:11:33', '2026-10-08 21:11:33', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "21:11"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_jt82evgk5_muzpg2tx', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 21:12:18', '2026-10-08 21:12:18', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "21:12"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_uhpusvozi_muzph22e', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 21:13:03', '2026-10-08 21:13:03', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "21:13"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_4223jhuzy_muzpibcp', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 21:14:02', '2026-10-08 21:14:02', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "21:14"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_oecngjo9n_muzpvv08', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 21:24:34', '2026-10-08 21:24:34', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "21:24"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_x8u23s3w8_muzqbhqz', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 21:36:43', '2026-10-08 21:36:43', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "21:36"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_f7myaritu_muzqwciz', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 21:52:56', '2026-10-08 21:52:56', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "21:52"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_g98ieiud7_muzrgp8f', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 22:08:46', '2026-10-08 22:08:46', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "22:08"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_m7ec1mw66_muzrqaq8', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 22:16:14', '2026-10-08 22:16:14', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "22:16"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_w1bizjomu_muzrs6hw', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 22:17:43', '2026-10-08 22:17:43', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "22:17"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_8koz0m2ma_muzryzw0', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 22:23:00', '2026-10-08 22:23:00', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "22:23"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_pltr61fi8_muzs1m33', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 22:25:05', '2026-10-08 22:25:05', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "22:25"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_j6pksilqa_muzs40jl', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 22:26:54', '2026-10-08 22:26:54', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "22:26"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_u0llgcybf_muzs6i33', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 22:28:50', '2026-10-08 22:28:50', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "22:28"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_a5ubmlp71_muzsg6ep', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 22:36:24', '2026-10-08 22:36:24', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "22:36"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_6pgs8n3rf_muzspzch', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 22:43:59', '2026-10-08 22:44:03', 4, 'Landing Page', 0, 2, '[{"action": "Landing Page", "time": "22:43"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_gp7nbgi2t_muzt6si0', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 22:57:03', '2026-10-08 22:57:07', 4, 'Landing Page', 0, 2, '[{"action": "Landing Page", "time": "22:57"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_nhv6xh3mk_muztb7jz', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 23:00:29', '2026-10-08 23:00:36', 7, 'Landing Page', 0, 2, '[{"action": "Landing Page", "time": "23:00"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_jti0byhu2_muztj2tv', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 23:06:41', '2026-10-08 23:06:41', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "23:06"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_8bv4ahcqb_muztku9q', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 23:08:03', '2026-10-08 23:08:03', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "23:08"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_gywcgwq5s_muztppmy', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 23:11:50', '2026-10-08 23:11:50', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "23:11"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_kw7zl996r_muzu4ilp', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 23:23:18', '2026-10-08 23:23:23', 5, 'Landing Page', 0, 2, '[{"action": "Landing Page", "time": "23:23"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_y3ifl7ayz_muzu884c', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-08 23:26:12', '2026-10-08 23:26:17', 5, 'Landing Page', 0, 2, '[{"action": "Landing Page", "time": "23:26"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_g4oz5ezgb_muzvk3hl', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 00:03:26', '2026-10-09 00:03:26', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "00:03"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_yjlnn3gwm_muzvlmkm', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 00:04:36', '2026-10-09 00:04:36', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "00:04"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_vgasiwd6n_mv0g8qur', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 09:42:25', '2026-10-09 09:42:44', 19, 'Landing Page', 0, 5, '[{"action": "Landing Page", "time": "09:42"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_o7s1ivi19_mv0ghn1k', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 09:49:22', '2026-10-09 09:49:47', 25, 'Landing Page', 0, 5, '[{"action": "Landing Page", "time": "09:49"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_fa17s8y3t_mv0glb3s', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 09:52:28', '2026-10-09 09:52:41', 13, 'Landing Page', 0, 3, '[{"action": "Landing Page", "time": "09:52"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_b3r7s20ga_mv0gnrke', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 09:54:06', '2026-10-09 09:54:35', 29, 'Landing Page', 0, 6, '[{"action": "Landing Page", "time": "09:54"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_wkstksli8_mv0gr7sk', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 09:56:47', '2026-10-09 09:57:15', 28, 'Landing Page', 0, 4, '[{"action": "Landing Page", "time": "09:56"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_h3lcnemhk_mv0gzrsc', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 10:03:26', '2026-10-09 10:03:30', 4, 'Landing Page', 0, 2, '[{"action": "Landing Page", "time": "10:03"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_ceyg7ebu8_mv0h2y1s', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 10:05:55', '2026-10-09 10:05:55', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "10:05"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_2y1x52gpe_mv0hjpop', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 10:18:57', '2026-10-09 10:18:57', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "10:18"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_2j9k06iio_mv0hlmer', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 10:20:26', '2026-10-09 10:20:26', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "10:20"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_stptbmckn_mv0isj0q', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 10:53:48', '2026-10-09 10:53:48', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "10:53"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_e766swvf6_mv0iv4lq', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 10:55:49', '2026-10-09 10:55:49', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "10:55"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_l0ibnnf4z_mv0j2d8x', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 11:01:27', '2026-10-09 11:01:27', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "11:01"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_35jiwmgbm_mv0j4qxn', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 11:03:18', '2026-10-09 16:26:04', 19366, 'Landing Page', 0, 292, '[{"action": "Landing Page", "time": "11:03"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_6sdknx94l_mv0j6gce', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 11:04:37', '2026-10-09 11:04:37', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "11:04"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_g9nc4rtj6_mv0j6otg', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 11:04:49', '2026-10-09 11:41:56', 2227, 'Landing Page', 0, 43, '[{"action": "Landing Page", "time": "11:04"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_00cd22auo_mv0kulx1', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 11:51:24', '2026-10-09 11:51:24', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "11:51"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_3tl0xhhve_mv0l0dup', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 11:55:53', '2026-10-09 11:55:53', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "11:55"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_x73t4unod_mv0l0ytu', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 11:56:20', '2026-10-09 11:56:20', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "11:56"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_y9ew1bvg0_mv0liqfi', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 12:10:09', '2026-10-09 12:10:09', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:10"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_02dz4qeuj_mv0lkfng', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 12:11:29', '2026-10-09 12:11:29', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:11"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_5kz5xv15w_mv0lktjh', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 12:11:47', '2026-10-09 12:11:47', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:11"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_q55ch9qvn_mv0lnme6', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 12:13:58', '2026-10-09 12:13:58', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:13"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_h7dm53mxa_mv0lt1ee', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 12:18:10', '2026-10-09 14:32:04', 8034, 'Landing Page', 0, 146, '[{"action": "Landing Page", "time": "12:18"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_7xwmaap88_mv0moflk', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 12:42:35', '2026-10-09 12:42:35', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:42"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_90gib6w81_mv0mqxob', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 12:44:31', '2026-10-09 12:44:31', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:44"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_jp387888x_mv0n0oef', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 12:52:06', '2026-10-09 12:52:06', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:52"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_9pv6j1pkx_mv0n3az6', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 12:54:09', '2026-10-09 12:54:09', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:54"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_07u7i4qnx_mv0o6v1f', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 13:24:54', '2026-10-09 13:24:54', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "13:24"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_7htf4pya9_mv0omtd3', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 13:37:19', '2026-10-09 13:37:19', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "13:37"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_mdblb01w3_mv0or3g1', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 13:40:38', '2026-10-09 13:40:38', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "13:40"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_0u0w7sukj_mv0osugq', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 13:42:00', '2026-10-09 13:42:00', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "13:42"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_8ua3bbro2_mv0ove2d', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 13:43:59', '2026-10-09 13:43:59', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "13:43"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_7068cs8o0_mv0pmgv3', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 14:05:03', '2026-10-09 16:26:04', 8461, 'Landing Page', 0, 116, '[{"action": "Landing Page", "time": "14:05"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_68seoaazq_mv0pn8se', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 14:05:38', '2026-10-09 14:05:38', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "14:05"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_9q9uw4lse_mv0prkt2', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-09 14:09:02', '2026-10-09 14:09:02', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "14:09"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_ztu9b9igq_mv9mw8vv', 'shivram@gmail.com', 'Shiv', 1, '2026-10-15 19:58:35', '2026-10-15 20:04:34', 359, 'Reading Topper Model Answer', 1, 15, '[{"action": "Landing Page", "time": "19:58"}, {"action": "Intake Deck (GS3 \u2022 15M)", "time": "19:59"}, {"action": "Shiv (shivram@gmail.com) is online", "detail": "Active on screen: Intake Deck (GS3 \u2022 15M)", "time": "19:59", "eval_id": "", "is_eval": false}, {"action": "Evaluated GS1 (15M) \u2014 Scored 6.5/15", "detail": "Q: The British victory in the Battle of Plassey in 1757 not just changed the course of I", "time": "20:00", "eval_id": "eval_1792074642_224d41", "is_eval": true}, {"action": "Intake Deck (GS1 \u2022 15M)", "time": "20:00"}, {"action": "Viewing Evaluation Studio", "time": "20:01"}, {"action": "Viewing Deep Evaluation", "time": "20:02"}, {"action": "Reading Topper Model Answer", "time": "20:04"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_guxm56bk0_mv9od058', 'shivram@gmail.com', 'Shiv', 1, '2026-10-15 20:39:36', '2026-10-15 21:32:39', 3183, 'Reading Topper Model Answer', 1, 62, '[{"action": "Landing Page", "time": "20:39"}, {"action": "Shiv (shivram@gmail.com) is online", "detail": "Active on screen: Landing Page", "time": "20:39", "eval_id": "", "is_eval": false}, {"action": "Evaluated GS4 (10M) \u2014 Scored 4.5/10", "detail": "Q: \u0915\u093f\u0938\u0940 \u0935\u094d\u092f\u0915\u094d\u0924\u093f \u0915\u0947 \u0926\u0943\u0937\u094d\u091f\u093f\u0915\u094b\u0923 \u0915\u0947 \u0918\u091f\u0915\u094b\u0902 \u092a\u0930 \u091a\u0930\u094d\u091a\u093e \u0915\u0940\u091c\u093f\u092f\u0947 \u0924\u0925\u093e \u092a\u094d\u0930\u0947\u0930\u0915 \u0938\u0902\u091a\u093e\u0930 \u090f\u0935\u0902 \u0938\u093e\u092e\u093e\u091c\u093f\u0915 \u092a\u094d\u0930\u092d\u093e", "time": "20:40", "eval_id": "eval_1792077017_5a1a80", "is_eval": true}, {"action": "Intake Deck (GS4 \u2022 10M)", "time": "20:40"}, {"action": "Viewing Evaluation Studio", "time": "20:40"}, {"action": "Reading Topper Model Answer", "time": "20:44"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_zivqozn8t_mvak4ad4', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 11:28:38', '2026-10-16 12:47:19', 4721, 'Landing Page', 0, 96, '[{"action": "Landing Page", "time": "11:28"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_vs45ijdf3_mvakw41j', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 11:50:16', '2026-10-16 11:50:16', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "11:50"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_90h33qn07_mval4i7a', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 11:56:48', '2026-10-16 11:56:48', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "11:56"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_f4et73ifg_mvalfqta', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:05:32', '2026-10-16 12:05:32', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:05"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_8fgujf1uc_mvalfurs', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:05:37', '2026-10-16 12:05:37', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:05"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_ulnediwzf_mvalizpl', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:08:04', '2026-10-16 12:08:04', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:08"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_ti31htw15_mvalu2pc', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:16:41', '2026-10-16 12:16:41', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:16"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_9iifvqyr9_mvalu6rx', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:16:46', '2026-10-16 12:16:46', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:16"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_lrvkwr8iv_mvalxbhf', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:19:12', '2026-10-16 12:19:12', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:19"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_fhvyfxtgi_mvalxfgg', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:19:17', '2026-10-16 12:19:17', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:19"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_zire91qnu_mvam8uas', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:28:10', '2026-10-16 12:28:10', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:28"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_6kwj4xt6j_mvam8ysl', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:28:15', '2026-10-16 12:28:15', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:28"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_d6bg7ym3d_mvamcxdg', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:31:20', '2026-10-16 12:31:20', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:31"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_6vcawikit_mvamd1th', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:31:26', '2026-10-16 12:31:26', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:31"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_r31lftblm_mvamf0de', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:32:58', '2026-10-16 12:32:58', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:32"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_bb910759j_mvamf45f', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:33:02', '2026-10-16 12:33:02', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:33"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_wz4x6kcne_mvamre3n', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:42:35', '2026-10-16 12:42:35', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:42"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_exs52dyaa_mvamrhqq', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 12:42:40', '2026-10-16 12:42:40', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "12:42"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_i54jquj78_mvaq7kdo', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 14:19:08', '2026-10-16 14:19:08', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "14:19"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_4cwy2yrlc_mvaqc8p6', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 14:22:46', '2026-10-16 14:22:46', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "14:22"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_x7nizqmlu_mvaqhr55', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 14:27:03', '2026-10-16 14:27:03', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "14:27"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_u5dw1p7cl_mvasbq5b', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 15:18:21', '2026-10-16 15:18:21', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "15:18"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_x9u9njgpl_mvasddj6', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 15:19:38', '2026-10-16 15:19:38', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "15:19"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_jh7prikiu_mvasfho7', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 15:21:17', '2026-10-16 15:21:17', 0, 'Viewing Evaluation Studio', 0, 1, '[{"action": "Viewing Evaluation Studio", "time": "15:21"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_sk349dtpy_mvat71o8', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 15:42:43', '2026-10-16 15:42:43', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "15:42"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_7g49c7u7p_mvatb1wu', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 15:45:50', '2026-10-16 15:45:50', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "15:45"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_84zsffzvy_mvau6oxm', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 16:10:26', '2026-10-16 16:10:26', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "16:10"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_pn7q6pl73_mvau824r', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 16:11:29', '2026-10-16 16:11:29', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "16:11"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_htia4ezla_mvau8gwv', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 16:11:49', '2026-10-16 16:11:49', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "16:11"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_g7guak84b_mvau96aq', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 16:12:22', '2026-10-16 16:12:22', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "16:12"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_vl7v2tvg1_mvaykep4', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 18:13:05', '2026-10-16 18:13:05', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "18:13"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_mvgnidu8l_mvayr3jh', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 18:18:16', '2026-10-16 18:18:16', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "18:18"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_ihker72t2_mvays482', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 18:19:04', '2026-10-16 18:19:04', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "18:19"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_fj4a4ofoi_mvayt2m4', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 18:19:48', '2026-10-16 18:19:48', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "18:19"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_9eol8wp16_mvaywz62', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 18:22:51', '2026-10-16 18:22:51', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "18:22"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_8zigz44il_mvb22zj5', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 19:51:31', '2026-10-16 19:51:31', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "19:51"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_docgz187l_mvb25ndm', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 19:53:34', '2026-10-16 19:53:34', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "19:53"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_4m6o0uol3_mvb29dvz', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 19:56:28', '2026-10-16 19:56:28', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "19:56"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_den3ypqm7_mvb2ds9u', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 19:59:54', '2026-10-16 19:59:54', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "19:59"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_0xwg9htp4_mvb2enps', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 20:00:34', '2026-10-16 20:00:34', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "20:00"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_i1wi65ghs_mvb2fkzr', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 20:01:18', '2026-10-16 20:01:18', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "20:01"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_ud1brj1fn_mvb2jg2q', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 20:04:18', '2026-10-16 20:04:18', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "20:04"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_or2jv7nur_mvb2lvlv', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 20:06:12', '2026-10-16 20:06:12', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "20:06"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_7p203hjk7_mvb2mlvj', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 20:06:45', '2026-10-16 20:06:45', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "20:06"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_dsg4e1fth_mvb2sejt', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 20:11:16', '2026-10-16 20:11:16', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "20:11"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_ahx2dm1x1_mvb3ekq9', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-16 20:28:30', '2026-10-16 20:28:30', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "20:28"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_yzc7q2qwm_mvfa00wz', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-19 18:44:14', '2026-10-19 18:44:14', 0, 'Intake Deck (GS3 • 15M)', 0, 1, '[{"action": "Intake Deck (GS3 \u2022 15M)", "time": "18:44"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_x314c5h2z_mvfa8uq9', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-19 18:51:05', '2026-10-19 18:51:05', 0, 'Intake Deck (GS3 • 15M)', 0, 1, '[{"action": "Intake Deck (GS3 \u2022 15M)", "time": "18:51"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_b7yyy0ewb_mvfbgr2d', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-19 19:25:13', '2026-10-19 19:25:13', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "19:25"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_qcn9okfqr_mvfbhg3n', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-19 19:25:46', '2026-10-19 19:25:46', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "19:25"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_g1eduoijm_mvfbhz6w', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-19 19:26:10', '2026-10-19 19:26:10', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "19:26"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_gejheoem7_mvfbj36d', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-19 19:27:02', '2026-10-19 19:27:02', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "19:27"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_3i2tne07r_mvfbks01', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-19 19:28:21', '2026-10-19 19:28:21', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "19:28"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_x1i8oucam_mvfdvh0a', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-19 20:32:40', '2026-10-19 20:32:40', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "20:32"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_1qd70dj4b_mvfg9cou', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-19 21:39:26', '2026-10-19 21:39:26', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "21:39"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_k96avzf9t_mvfgagm0', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-19 21:40:18', '2026-10-19 21:40:18', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "21:40"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_8ugt2lh1v_mvfgbo02', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-19 21:41:14', '2026-10-19 21:41:14', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "21:41"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES ('sid_ge3oce4vz_mvmew8cx', 'Guest Aspirant', 'Guest Aspirant', 0, '2026-10-24 18:35:38', '2026-10-24 18:35:38', 0, 'Landing Page', 0, 1, '[{"action": "Landing Page", "time": "18:35"}]', '2026', 'PSIR')
ON CONFLICT (id) DO NOTHING;

-- 4. EVALUATIONS 1 TO 4
INSERT INTO evaluations (id, user_id, user_email, paper, max_marks, question, overall_score, percentage, evaluation_json, pages_json, thumbnail, is_rewrite, file_hash, has_been_rewritten, rewrite_eval_id, baseline_eval_id, file_url, created_at)
VALUES ('eval_1792243539_0fd39e', '6d9e72ad-1c3d-5976-9ab1-21d14de1dd7a', 'guest@cookedmains.in', 'Essay', 125, 'Courage is resistance to fear, mastery of fear, not absence of fear.', 25, 20, '{"overall_score": 25.0, "max_marks": 125, "percentile_verdict": "Needs Work (<38%)", "detected_question": "Courage is resistance to fear, mastery of fear, not absence of fear.", "detected_paper": "Essay", "detected_paper_display": "UPSC Essay Paper (125 Marks)", "evaluation_dimensions": [{"dimension_id": "thesis_framing", "name": "Thesis Articulation & Framing", "awarded_marks": 5.0, "max_marks": 20.0, "status": "Needs Nuance", "feedback": "No text provided by the candidate across the evaluated page.", "page_references": [1]}, {"dimension_id": "multidimensional_depth", "name": "Multi-Dimensionality & Analytical Depth", "awarded_marks": 10.0, "max_marks": 50.0, "status": "Needs Nuance", "feedback": "Completely blank response. No analytical dimensions, philosophical perspectives, or socio-economic contexts were explored.", "page_references": [1]}, {"dimension_id": "structure_and_flow", "name": "Structure, Transitions & Narrative Coherence", "awarded_marks": 5.0, "max_marks": 20.0, "status": "Needs Nuance", "feedback": "Absence of text prevents any evaluation of structure or organic flow.", "page_references": [1]}, {"dimension_id": "evidence_and_examples", "name": "Substantiation, Thinkers & Contemporary Examples", "awarded_marks": 2.5, "max_marks": 20.0, "status": "Needs Nuance", "feedback": "No thinkers, quotes, historical cases, or real-world examples were provided.", "page_references": [1]}, {"dimension_id": "concluding_synthesis", "name": "Concluding Synthesis & Visionary Resolution", "awarded_marks": 2.5, "max_marks": 15.0, "status": "Needs Nuance", "feedback": "No concluding synthesis or visionary resolution present.", "page_references": [1]}], "argument_journey": [{"stage_title": "Stage 1: Blank Submission \u2014 Incomplete Attempt", "original_page_number": 1, "page_role": "Opening Hook", "concise_summary": "The candidate has submitted a blank booklet page with no substantive arguments or text.", "verbatim_quote": "...", "what_stage_contributes": "Does not contribute any argument towards the central essay topic.", "transition_or_gap": "Complete absence of response.", "status": "drift", "status_label": "Concluding Synthesis"}], "intro_audit": {"intro_score": 5.0, "intro_max": 20.0, "intro_archetype": "Anecdotal Hook", "topic_vs_question_relevance": "Zero content provided to evaluate relevance.", "current_critique": "The candidate''s booklet is entirely blank. For the UPSC Mains Essay paper, failing to write an essay results in a zero for the paper, severely impacting overall rank and selection prospects.", "opening_passage": "..."}, "body_audit": {"body_score": 17.5, "body_max": 90.0, "strengths": ["None identified due to blank submission."], "critical_gaps": ["Entire essay body is missing (Page 1).", "Failure to engage with any dimensions of the essay topic ''Courage is resistance to fear, mastery of fear, not absence of fear''."], "missing_dimensions": ["Philosophical and ethical dimensions of fear and courage.", "Historical and political resistance movements.", "Socio-economic vulnerabilities and administrative courage.", "Psychological mastery of fear in modern life."], "examiner_guidance": "Ensure time management in the examination hall so that all assigned essay topics are attempted. Even a structured outline with basic arguments yields better marks than a blank page."}, "conclusion_audit": {"conclusion_score": 2.5, "conclusion_max": 15.0, "conclusion_archetype": "Cohesive Synthesis", "failure_mode": "Abrupt Ending", "current_critique": "No conclusion was written.", "way_ahead_prescriptions": "Practice full-length essay writing under timed conditions to build stamina and prevent leaving booklets blank."}, "point_by_point_audit": [{"page": 1, "title": "Stage 1: Blank Page", "what_you_wrote": "...", "evaluator_remark": "No text written on this page. Please ensure regular writing practice.", "examiner_verdict": "Unattempted", "verdict": "Superficial", "badge": "Philosophical Hook"}], "visual_annotations": [{"page": 1, "box_2d": [100, 100, 300, 900], "quote": "...", "label": "Examiner Margin Note", "tag": "Examiner Margin Note", "remark": "Unattempted essay booklet page. Zero marks awarded.", "text": "Unattempted essay booklet page. Zero marks awarded.", "type": "critical", "start_y_percent": 10.0, "end_y_percent": 30.0}], "revision_priorities": [{"title": "Complete Examination Attempt", "page": 1, "candidate_exact_passage": "...", "evaluator_diagnosis": "The candidate did not write any content for the 125-mark essay question.", "actionable_guidance": "Develop a structured template for essay writing including introduction, multi-dimensional body paragraphs, and a visionary conclusion.", "optional_example_rewrite": "Mark Twain once noted, ''Courage is resistance to fear, mastery of fear, not absence of fear''\u2014a profound reminder that bravery is not the absence of terror, but the triumph over it."}], "rubric_scores": {"intro_score": 0.0, "core_demand_score": 0.0, "value_add_score": 0.0, "presentation_score": 0.0, "context_score": 0.0}, "upsc_exam_hall_discipline": {"estimated_word_count": 2, "estimated_writing_time_mins": "Unavailable", "word_budget_status": "Under target (2 words)", "margin_discipline": "Maintained strictly", "handwriting_legibility": "Clean & Readable"}, "next_attempt_focus": {"thesis_crystallization": "Ensure every essay begins with a clear philosophical framing of the core quote.", "student_draft_quote": "...", "booklet_placement": "Page 1, Paragraph 1", "examiner_upgrade_sentence": "True courage is forged not in the absence of peril, but in the deliberate mastery of one''s deepest anxieties."}, "model_answer": "Introduction: Open with Mark Twain''s definition or a reflection on human vulnerability. Define courage not as fearlessness (like a reckless machine), but as moral and physical endurance in the face of terror. Body Paragraphs: 1. Philosophical Dimension: Aristotle''s Golden Mean between cowardice and rashness. 2. Historical Dimension: Nelson Mandela or Mahatma Gandhi acknowledging fear while fighting systemic oppression. 3. Socio-Economic Dimension: Marginalized sections overcoming systemic barriers despite fear of failure or reprisal. 4. Administrative Dimension: Civil servants standing up to political corruption or handling disaster management amidst uncertainty. Conclusion: Synthesize that fear is a natural evolutionary guardrail, but courage is the human agency that transforms fear into purposeful action.", "transcribed_text": "[Page 1]\n", "pages": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=="], "page_ledger": {"1": {"original_page_number": 1, "status": "processed", "role": "Blank page", "word_count": 0, "uncertain_spans_count": 0}}, "_meta_eval_id": "eval_1792243539_0fd39e", "_meta_created_at": "2026-10-17 13:25:39", "created_at": "2026-10-17 13:25:39", "evaluated_at": "2026-10-17 13:25:39", "_meta_user_email": "guest@cookedmains.in", "_meta_paper": "Essay", "_meta_max_marks": 125, "_meta_is_rewrite": 0, "_meta_baseline_eval_id": null, "_meta_file_hash": null, "_meta_visual_hashes": ["0000000000000000"], "_meta_thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z", "_meta_pages": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z"]}', '["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=="]', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z', 0, '', 0, NULL, NULL, NULL, '2026-10-17 13:25:39')
ON CONFLICT (id) DO NOTHING;

INSERT INTO evaluations (id, user_id, user_email, paper, max_marks, question, overall_score, percentage, evaluation_json, pages_json, thumbnail, is_rewrite, file_hash, has_been_rewritten, rewrite_eval_id, baseline_eval_id, file_url, created_at)
VALUES ('eval_1792237107_48cc05', '6d9e72ad-1c3d-5976-9ab1-21d14de1dd7a', 'guest@cookedmains.in', 'Essay', 125, 'Courage is resistance to fear, mastery of fear, not absence of fear.', 25, 20, '{"overall_score": 25.0, "max_marks": 125, "percentile_verdict": "Needs Work (<38%)", "detected_question": "Courage is resistance to fear, mastery of fear, not absence of fear.", "detected_paper": "Essay", "detected_paper_display": "UPSC Essay Paper (125 Marks)", "intro_audit": {"intro_score": 0.0, "intro_max": 20.0, "intro_archetype": "Philosophical Inversion", "topic_vs_question_relevance": "No candidate text was provided in the booklet.", "current_critique": "The evaluation booklet page submitted is entirely blank. No introduction, body paragraphs, or conclusion have been written.", "opening_passage": "..."}, "body_audit": {"body_score": 0.0, "body_max": 85.0, "strengths": ["No content provided on Page 1 to evaluate strengths."], "critical_gaps": ["The entire essay booklet is blank (Page 1 contains no candidate text or substantive arguments).", "Failure to attempt the essay paper results in a zero score across all multi-dimensional parameters (philosophical, ethical, historical, socio-cultural, economic, administrative, global, scientific)."], "missing_dimensions": ["All dimensions are missing due to an unattempted answer booklet."], "examiner_guidance": "Ensure you budget your 3-hour UPSC Mains examination time effectively. Leaving an essay booklet completely blank results in automatic disqualification or zero marks for the paper. Practice writing full-length 1000-1200 word essays within the 1-hour 15-minute timeframe allocated per essay."}, "conclusion_audit": {"conclusion_score": 0.0, "conclusion_max": 20.0, "conclusion_archetype": "Cohesive Synthesis", "failure_mode": "Abrupt Ending", "current_critique": "No conclusion was written as the booklet is entirely blank.", "way_ahead_prescriptions": "Always structure your essay with a clear introduction, 5-7 multi-dimensional body paragraphs, and a visionary conclusion synthesizing the central philosophical thesis."}, "point_by_point_audit": [{"page": 1, "what_you_wrote": "...", "evaluator_remark": "The page is completely blank. No attempt was made to write on the essay topic.", "verdict": "Superficial", "badge": "Philosophical Hook"}], "visual_annotations": [{"page": 1, "box_2d": [100, 100, 900, 900], "label": "Unattempted Booklet", "text": "Entire page is blank. Zero marks awarded.", "type": "critical"}], "rubric_scores": {"intro_score": 0.0, "core_demand_score": 0.0, "value_add_score": 0.0, "presentation_score": 0.0, "context_score": 0.0}, "upsc_exam_hall_discipline": {"handwriting_legibility": "Clean & Readable", "margin_discipline": "Maintained strictly", "word_count_compliance": "Target: ~1000-1200 words across booklet pages (0 words written)"}, "next_attempt_focus": {"thesis_crystallization": "Begin with a compelling Socratic or philosophical inquiry defining courage not as fearlessness, but as the active governance of fear by reason and moral duty.", "student_draft_quote": "...", "booklet_placement": "Page 1, Introduction Paragraph 1", "examiner_upgrade_sentence": "True courage is not the stony apathy of the fearless, but the vibrating tension of a soul fully aware of peril yet choosing duty over despair."}, "model_answer": "Blueprint for ''Courage is resistance to fear, mastery of fear, not absence of fear'':\n1. Introduction: Define courage through Mark Twain''s perspective (''Courage is resistance to fear, mastery of fear, not absence of fear''). Contrast the foolhardy absence of fear with true moral and physical courage.\n2. Philosophical & Ethical Dimension: Mark Twain, Aristotle''s Golden Mean (courage as the mean between cowardice and rashness), Bhagavad Gita (Arjuna overcoming paralysis of fear through duty/Dharma).\n3. Historical & Freedom Struggle Dimension: Indian freedom fighters facing colonial repression; Nelson Mandela defining courage not as the absence of fear, but the triumph over it.\n4. Socio-Cultural & Psychological Dimension: Overcoming social stigmas, whistleblowers, marginalized communities fighting systemic oppression, mental health resilience.\n5. Administrative & Governance Dimension: Civil servants taking bold policy decisions under political or bureaucratic pressure, standing up for integrity.\n6. Scientific & Technological Dimension: Scientists venturing into the unknown (space exploration, pandemic vaccine development like Covaxin/Covishield despite uncertainty).\n7. Conclusion: Synthesize that fear is a natural biological sentinel, but courage is the human capacity to subordinate fear to higher ethical ideals, ensuring human progress and justice.", "transcribed_text": "[Page 1]\n", "_meta_eval_id": "eval_1792237107_48cc05", "_meta_created_at": "2026-10-17 11:38:27", "created_at": "2026-10-17 11:38:27", "evaluated_at": "2026-10-17 11:38:27", "_meta_user_email": "guest@cookedmains.in", "_meta_paper": "Essay", "_meta_max_marks": 125, "_meta_is_rewrite": 0, "_meta_baseline_eval_id": null, "_meta_file_hash": null, "_meta_visual_hashes": ["0000000000000000"], "_meta_thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z", "_meta_pages": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z"]}', '["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=="]', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z', 0, '', 0, NULL, NULL, NULL, '2026-10-17 11:38:27')
ON CONFLICT (id) DO NOTHING;

INSERT INTO evaluations (id, user_id, user_email, paper, max_marks, question, overall_score, percentage, evaluation_json, pages_json, thumbnail, is_rewrite, file_hash, has_been_rewritten, rewrite_eval_id, baseline_eval_id, file_url, created_at)
VALUES ('eval_1792237058_d2a573', '6d9e72ad-1c3d-5976-9ab1-21d14de1dd7a', 'guest@cookedmains.in', 'Essay', 125, 'Courage is resistance to fear, mastery of fear, not absence of fear.', 25, 20, '{"overall_score": 25.0, "max_marks": 125, "percentile_verdict": "Needs Work (<38%)", "detected_question": "Courage is resistance to fear, mastery of fear, not absence of fear.", "detected_paper": "Essay", "detected_paper_display": "UPSC Essay Paper (125 Marks)", "intro_audit": {"intro_score": 0.0, "intro_max": 20.0, "intro_archetype": "Philosophical Inversion", "topic_vs_question_relevance": "No response provided by the candidate.", "current_critique": "The candidate has submitted a completely blank answer copy (Page 1 is blank). No introduction or thesis was articulated.", "opening_passage": "[No text written by candidate]"}, "body_audit": {"body_score": 0.0, "body_max": 85.0, "strengths": [], "critical_gaps": ["The entire essay booklet was left blank across Page 1, resulting in zero marks across all dimensions of the UPSC Essay evaluation rubric.", "Complete failure to engage with the philosophical depth, multi-dimensional exploration, and substantive requirements of the prompt."], "missing_dimensions": ["Philosophical definition of fear and courage (Mark Twain, Nelson Mandela)", "Ethical and administrative courage in civil services", "Historical and socio-cultural dimensions of overcoming fear"], "examiner_guidance": "Ensure time management is strictly monitored in the examination hall. Leaving an entire 125-mark essay blank leads to instant disqualification from the competitive merit list. Practice writing at least a basic outline and introduction even under severe time constraints."}, "conclusion_audit": {"conclusion_score": 0.0, "conclusion_max": 20.0, "conclusion_archetype": "Cohesive Synthesis", "failure_mode": "Abrupt Ending", "current_critique": "No conclusion was attempted as the paper is completely blank.", "way_ahead_prescriptions": "Develop a structured template for essay writing including a standard introduction, 4-5 thematic body paragraphs, and a forward-looking conclusion."}, "point_by_point_audit": [{"page": 1, "what_you_wrote": "", "evaluator_remark": "The page is completely blank. No substantive argument or evidence was presented.", "verdict": "Superficial", "badge": "Philosophical Hook"}], "visual_annotations": [{"page": 1, "box_2d": [100, 100, 900, 900], "label": "Unattempted Question", "text": "Zero marks awarded. Entire answer booklet left blank.", "type": "critical"}], "rubric_scores": {"intro_score": 0.0, "core_demand_score": 0.0, "value_add_score": 0.0, "presentation_score": 0.0, "context_score": 0.0}, "upsc_exam_hall_discipline": {"handwriting_legibility": "Clean & Readable", "margin_discipline": "Maintained strictly", "word_count_compliance": "0 words (Target: 1000-1200 words)"}, "next_attempt_focus": {"thesis_crystallization": "Must define the core philosophical premise in the opening 150 words rather than leaving the booklet blank.", "student_draft_quote": "[No text available]", "booklet_placement": "Page 1, Paragraph 1", "examiner_upgrade_sentence": "Courage is not the absence of fear, but the triumph over it. The brave man is not he who does not feel afraid, but he who conquers that fear."}, "model_answer": "Introduction: Begin with Mark Twain''s insight: ''Courage is resistance to fear, mastery of fear, not absence of fear.'' Define fear as a natural evolutionary instinct and courage as a conscious ethical choice. Body Paragraph 1 (Philosophical & Ethical): Contrast recklessness (absence of fear) with true courage (mastery of fear). Aristotle''s doctrine of the mean where courage lies between cowardice and rashness. Body Paragraph 2 (Historical & Freedom Struggle): Mahatma Gandhi''s philosophy of Satyagraha\u2014overcoming the fear of the oppressor through moral force. Nelson Mandela''s observation that courage is the triumph over fear. Body Paragraph 3 (Socio-Cultural & Gender): Overcoming societal dogmas, patriarchal norms, and institutional barriers. Women standing up against regressive traditions. Body Paragraph 4 (Administrative & Civil Services): The courage of conviction for a civil servant\u2014standing up against political expediency, upholding constitutional morality, and speaking truth to power. Body Paragraph 5 (Global & Scientific): Scientific endeavors, space exploration, and handling global crises like pandemics where uncertainty breeds fear. Conclusion: Synthesize that in an increasingly complex world, true progress relies not on fearless individuals, but on those who acknowledge fear and act with moral and physical resilience.", "transcribed_text": "[Page 1]\n", "_meta_eval_id": "eval_1792237058_d2a573", "_meta_created_at": "2026-10-17 11:37:38", "created_at": "2026-10-17 11:37:38", "evaluated_at": "2026-10-17 11:37:38", "_meta_user_email": "guest@cookedmains.in", "_meta_paper": "Essay", "_meta_max_marks": 125, "_meta_is_rewrite": 0, "_meta_baseline_eval_id": null, "_meta_file_hash": null, "_meta_visual_hashes": ["0000000000000000"], "_meta_thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z", "_meta_pages": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z"]}', '["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=="]', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z', 0, '', 0, NULL, NULL, NULL, '2026-10-17 11:37:38')
ON CONFLICT (id) DO NOTHING;

INSERT INTO evaluations (id, user_id, user_email, paper, max_marks, question, overall_score, percentage, evaluation_json, pages_json, thumbnail, is_rewrite, file_hash, has_been_rewritten, rewrite_eval_id, baseline_eval_id, file_url, created_at)
VALUES ('eval_1792237009_a055c2', '6d9e72ad-1c3d-5976-9ab1-21d14de1dd7a', 'guest@cookedmains.in', 'Essay', 125, 'Courage is resistance to fear, mastery of fear, not absence of fear.', 25, 20, '{"overall_score": 25.0, "max_marks": 125, "percentile_verdict": "Needs Work (<38%)", "detected_question": "Courage is resistance to fear, mastery of fear, not absence of fear.", "detected_paper": "Essay", "detected_paper_display": "UPSC Essay Paper (125 Marks)", "intro_audit": {"intro_score": 0.0, "intro_max": 20.0, "intro_archetype": "Philosophical Inversion", "topic_vs_question_relevance": "Zero relevance due to a completely blank answer booklet.", "current_critique": "The candidate has submitted a completely blank page for the essay. No introduction, body, or conclusion was written. Evaluation is impossible beyond awarding the baseline zero.", "opening_passage": "..."}, "body_audit": {"body_score": 0.0, "body_max": 85.0, "strengths": ["No content provided on Page 1 to evaluate strengths."], "critical_gaps": ["Entire essay booklet left blank on Page 1. Zero arguments, dimensions, or examples provided.", "Complete failure to attempt the 125-mark UPSC Mains Essay paper within the stipulated time."], "missing_dimensions": ["All dimensions\u2014philosophical, ethical, historical, socio-cultural, administrative, economic, and global\u2014are entirely missing."], "examiner_guidance": "Time management and exam-hall strategy must be urgently reviewed. Leaving an essay booklet blank results in an automatic disqualification from competitive scoring in UPSC Mains. Practice writing full-length 1000-word essays under timed conditions immediately."}, "conclusion_audit": {"conclusion_score": 0.0, "conclusion_max": 20.0, "conclusion_archetype": "Cohesive Synthesis", "failure_mode": "Abrupt Ending", "current_critique": "No conclusion was attempted as the page is entirely blank.", "way_ahead_prescriptions": "Ensure that every essay is structured with a clear introduction, 5-6 multi-dimensional body paragraphs, and a visionary conclusion, even if pressed for time."}, "point_by_point_audit": [{"page": 1, "what_you_wrote": "...", "evaluator_remark": "The page is completely blank. No content was written by the candidate.", "verdict": "Superficial", "badge": "Synthesis"}], "visual_annotations": [{"page": 1, "box_2d": [100, 100, 900, 900], "label": "Examiner Margin Note", "text": "BLANK COPY - ZERO MARKS AWARDED. Attempt is mandatory for evaluation.", "type": "critical"}], "rubric_scores": {"intro_score": 0.0, "core_demand_score": 0.0, "value_add_score": 0.0, "presentation_score": 0.0, "context_score": 0.0}, "upsc_exam_hall_discipline": {"handwriting_legibility": "Dense / Needs Spacing", "margin_discipline": "Maintained strictly", "word_count_compliance": "Target: ~1000-1200 words across booklet pages (0 words written)"}, "next_attempt_focus": {"thesis_crystallization": "Must define the core philosophical premise in the opening paragraph: Mark Twain''s definition of courage as resistance to and mastery of fear, not its absence.", "student_draft_quote": "...", "booklet_placement": "Page 1, Paragraph 1", "examiner_upgrade_sentence": "Courage is not the absence of trembling, but the triumph over it."}, "model_answer": "Introduction: Open with Mark Twain''s timeless observation: ''Courage is resistance to fear, mastery of fear, not absence of fear.'' Define fear as a natural evolutionary mechanism and courage as the conscious moral choice to act despite it.\n\nPhilosophical & Ethical Dimension: Examine Aristotle''s golden mean where courage lies between cowardice (excess of fear) and rashness (deficiency of fear). Discuss how moral courage differs from physical bravery.\n\nHistorical & Political Dimension: Cite examples of freedom fighters like Mahatma Gandhi or Nelson Mandela who experienced profound internal fear yet mastered it to lead mass movements against injustice.\n\nSocio-Cultural & Economic Dimension: Discuss whistleblowers, civil servants standing up against political interference, and everyday citizens facing economic precarity with resilience.\n\nConclusion: Conclude by synthesizing that true progress of civilization rests not on those who never feel afraid, but on those who acknowledge fear and conquer it for a higher collective good.", "transcribed_text": "[Page 1]\n", "_meta_eval_id": "eval_1792237009_a055c2", "_meta_created_at": "2026-10-17 11:36:49", "created_at": "2026-10-17 11:36:49", "evaluated_at": "2026-10-17 11:36:49", "_meta_user_email": "guest@cookedmains.in", "_meta_paper": "Essay", "_meta_max_marks": 125, "_meta_is_rewrite": 0, "_meta_baseline_eval_id": null, "_meta_file_hash": null, "_meta_visual_hashes": ["0000000000000000"], "_meta_thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z", "_meta_pages": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z"]}', '["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=="]', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z', 0, '', 0, NULL, NULL, NULL, '2026-10-17 11:36:49')
ON CONFLICT (id) DO NOTHING;

COMMIT;
