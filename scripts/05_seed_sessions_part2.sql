BEGIN;

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

COMMIT;
