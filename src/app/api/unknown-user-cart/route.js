// its also working
import {dbconnect} from "../../../lib/dbCOnnect";
import {Product} from "@/models/Product";

export default async function POST(req) {
  await dbconnect();
  const ids = req.body.ids;
  return Response.json(await Product.find({_id:ids}));
}