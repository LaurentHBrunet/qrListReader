import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Group = new Schema({
    teacher: {
        type: String,
        default: 'Undefined'
    },
    activity: {
        type: String,
        default: 'Undefined'
    },
    students: {
        type: [String]
    }
});

export default mongoose.model('Group', Group);