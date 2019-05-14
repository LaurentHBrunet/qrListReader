import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose, { mongo } from 'mongoose';

import Group from './models/Group';
import { runInNewContext } from 'vm';

const app = express();
const port = 4000;
const router = express.Router();
const dbUrl = 'mongodb://laurenthb:laurenthb1@ds119014.mlab.com:19014/qr_list_test';

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(dbUrl, { useNewUrlParser: true})
    .catch(err => {
        console.log(err);
    });

const connection = mongoose.connection;

connection.once('open', () => console.log('Connection established to MongoDB -- Success'));

router.route('/groups-list').get((req, res) => {
    Group.find((err, groups) => {
        if (err) {
            console.log(err);
        } else {
            res.json(groups);
        }
    });
});

router.route('/groups-list/:id').get((req, res) => {
    Group.findById(req.params.id, (err, group) => {
        if (err) {
            console.log(err);
        } else {
            res.json(group);
        }
    });
});

router.route('/groups-list/add').post((req, res) => {
    let group = new Group(req.body);
    console.log(req.body);
    group.save()
        .then(group => {
            res.status(200).json({
                'group': 'Added successfully'
            });
        })
        .catch( err => {
            res.status(400).send('Failed to create group');
        });
});

router.route('/groups-list/update/:id').post((req, res) => {
    Group.findById(req.params.id, (err, group) => {
        if (!group) {
            return next(new Error('Could not find group'));
        } else {
            group.teacher = req.body.teacher;
            group.activity = req.body.activity;
            group.students = req.body.students;

            group.save().then( group => {
                res.json('Group updated');
            }).catch(err => {
                res.status(400).send('Group update failed');
            });
        }
    });
});

router.route('/groups-list/delete/:id').delete((req, res) => {
    Group.findByIdAndRemove({ _id: req.params.id }, (err, group) => {
        if (err) {
            res.json(err);
        } else {
            res.json('Group removed');
        }
    });
})

app.use('/', router);

app.listen(port, () => console.log('Server running on port ' + port));